import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERNAME = 'OmSharma152';
const OUTPUT_FILE = path.join(__dirname, '../../src/data/coding-stats.json');

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function fetchFromLeetCodeGraphQL(username) {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          userAvatar
          ranking
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        userCalendar {
          streak
          totalActiveDays
          submissionCalendar
        }
      }
      recentAcSubmissionList(username: $username, limit: 10) {
        title
        titleSlug
        timestamp
      }
    }
  `;

  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': `https://leetcode.com/u/${username}/`
    },
    body: JSON.stringify({
      query,
      variables: { username }
    })
  });

  if (!response.ok) {
    throw new Error(`LeetCode GraphQL HTTP error: ${response.status}`);
  }

  const result = await response.json();
  if (result.errors && result.errors.length > 0) {
    throw new Error(`LeetCode GraphQL error: ${result.errors[0].message}`);
  }

  const data = result.data;
  if (!data || !data.matchedUser) {
    throw new Error(`User ${username} not found on LeetCode.`);
  }

  return parseLeetCodeGraphQLData(data, username);
}

async function fetchFromFallbackAPI(username) {
  console.log('Attempting fallback LeetCode API...');
  const res = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`);
  if (!res.ok) {
    throw new Error(`Fallback API HTTP error: ${res.status}`);
  }
  const data = await res.json();
  if (data.errors || !data.totalSolved) {
    throw new Error('Fallback API returned invalid structure.');
  }

  return {
    username: username,
    profileUrl: `https://leetcode.com/u/${username}/`,
    avatarUrl: data.avatar || '',
    ranking: data.ranking || 0,
    stats: {
      totalSolved: data.totalSolved || 0,
      easySolved: data.easySolved || 0,
      mediumSolved: data.mediumSolved || 0,
      hardSolved: data.hardSolved || 0,
      currentStreak: 0,
      longestStreak: 0,
      totalActiveDays: data.totalActiveDays || 0
    },
    submissionCalendar: data.submissionCalendar ? JSON.parse(typeof data.submissionCalendar === 'string' ? data.submissionCalendar : JSON.stringify(data.submissionCalendar)) : {},
    recentSubmissions: (data.recentSubmissions || []).slice(0, 10).map(s => ({
      title: s.title,
      titleSlug: s.titleSlug || s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      timestamp: parseInt(s.timestamp || Date.now() / 1000, 10),
      statusDisplay: s.statusDisplay || 'Accepted',
      lang: s.lang || 'java'
    }))
  };
}

function calculateStreaks(submissionCalendar) {
  if (!submissionCalendar || typeof submissionCalendar !== 'object') {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Convert timestamps to YYYY-MM-DD in UTC
  const activeDateSet = new Set();
  Object.keys(submissionCalendar).forEach(tsStr => {
    const ts = parseInt(tsStr, 10);
    if (!isNaN(ts) && submissionCalendar[tsStr] > 0) {
      const dateStr = new Date(ts * 1000).toISOString().split('T')[0];
      activeDateSet.add(dateStr);
    }
  });

  if (activeDateSet.size === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sortedDates = Array.from(activeDateSet).sort();
  
  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  for (const dateStr of sortedDates) {
    const curDate = new Date(dateStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffTime = curDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
      if (diffDays === 1) {
        tempStreak += 1;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = curDate;
  }

  // Calculate current streak ending today or yesterday
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let currentStreak = 0;
  let checkDate = activeDateSet.has(todayStr) ? new Date(todayStr) : (activeDateSet.has(yesterdayStr) ? new Date(yesterdayStr) : null);

  while (checkDate) {
    const dateKey = checkDate.toISOString().split('T')[0];
    if (activeDateSet.has(dateKey)) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { currentStreak, longestStreak };
}

function parseLeetCodeGraphQLData(data, username) {
  const user = data.matchedUser;
  const acStats = user.submitStatsGlobal?.acSubmissionNum || [];

  const getCount = (diff) => {
    const item = acStats.find(s => s.difficulty.toLowerCase() === diff.toLowerCase());
    return item ? item.count : 0;
  };

  const totalSolved = getCount('All');
  const easySolved = getCount('Easy');
  const mediumSolved = getCount('Medium');
  const hardSolved = getCount('Hard');

  let calendarObj = {};
  if (user.userCalendar && user.userCalendar.submissionCalendar) {
    try {
      calendarObj = typeof user.userCalendar.submissionCalendar === 'string'
        ? JSON.parse(user.userCalendar.submissionCalendar)
        : user.userCalendar.submissionCalendar;
    } catch (e) {
      console.warn('Failed to parse submissionCalendar JSON:', e.message);
    }
  }

  const { currentStreak, longestStreak } = calculateStreaks(calendarObj);

  const lcStreak = user.userCalendar?.streak || 0;
  const finalCurrentStreak = Math.max(currentStreak, lcStreak);
  const finalLongestStreak = Math.max(longestStreak, finalCurrentStreak);

  const recentSubmissions = (data.recentAcSubmissionList || []).map(s => ({
    title: s.title,
    titleSlug: s.titleSlug,
    timestamp: parseInt(s.timestamp, 10),
    statusDisplay: 'Accepted',
    lang: s.lang || 'java'
  }));

  return {
    username: username,
    profileUrl: `https://leetcode.com/u/${username}/`,
    avatarUrl: user.profile?.userAvatar || '',
    ranking: user.profile?.ranking || 0,
    stats: {
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      currentStreak: finalCurrentStreak,
      longestStreak: finalLongestStreak,
      totalActiveDays: user.userCalendar?.totalActiveDays || Object.keys(calendarObj).length
    },
    submissionCalendar: calendarObj,
    recentSubmissions
  };
}

async function main() {
  console.log(`Fetching LeetCode statistics for user: ${USERNAME}...`);

  let existingData = null;
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    } catch (e) {
      console.warn('Could not read existing coding-stats.json:', e.message);
    }
  }

  let leetcodeData = null;

  try {
    leetcodeData = await fetchFromLeetCodeGraphQL(USERNAME);
    console.log('Successfully fetched LeetCode data via GraphQL API.');
  } catch (err) {
    console.warn('LeetCode GraphQL API failed:', err.message);
    try {
      leetcodeData = await fetchFromFallbackAPI(USERNAME);
      console.log('Successfully fetched LeetCode data via Fallback API.');
    } catch (fallbackErr) {
      console.error('Fallback API also failed:', fallbackErr.message);
    }
  }

  if (!leetcodeData) {
    if (existingData && existingData.platforms?.leetcode) {
      console.warn('Using existing cached LeetCode data as fallback.');
      leetcodeData = existingData.platforms.leetcode;
    } else {
      console.warn('Generating default placeholder LeetCode structure.');
      leetcodeData = {
        username: USERNAME,
        profileUrl: `https://leetcode.com/u/${USERNAME}/`,
        avatarUrl: '',
        ranking: 0,
        stats: {
          totalSolved: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalActiveDays: 0
        },
        submissionCalendar: {},
        recentSubmissions: []
      };
    }
  }

  const finalOutput = {
    lastUpdated: new Date().toISOString(),
    platforms: {
      leetcode: leetcodeData,
      codeforces: existingData?.platforms?.codeforces || null,
      hackerrank: existingData?.platforms?.hackerrank || null,
      github: existingData?.platforms?.github || null
    }
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalOutput, null, 2), 'utf8');
  console.log(`Successfully updated statistics in ${OUTPUT_FILE}`);
}

main().catch(err => {
  console.error('Fatal error in fetch script:', err);
  process.exit(0);
});
