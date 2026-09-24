import { meta, shopify, starbucks, tesla } from "../assets/images";
import {
    car,
    codeforces,
    contact,
    css,
    estate,
    express,
    git,
    github,
    gla,
    google,
    hackerrank,
    hospital,
    html,
    infosys,
    instagram,
    java,
    javascript,
    leetcode,
    linkedin,
    mongodb,
    motion,
    mui,
    nextjs,
    nodejs,
    oracle,
    portfolio3d,
    pricewise,
    python,
    react,
    redux,
    sass,
    snapgram,
    summiz,
    tailwindcss,
    threads,
    typescript
} from "../assets/icons";

export const skills = [
    {
        imageUrl: java,
        name: "Java",
        type: "Programming Language",
    },
    {
        imageUrl: python,
        name: "Python",
        type: "Programming Language",
    },
    {
        imageUrl: javascript,
        name: "JavaScript",
        type: "Programming Language",
    },
    {
        imageUrl: html,
        name: "HTML5",
        type: "Frontend",
    },
    {
        imageUrl: css,
        name: "CSS3",
        type: "Frontend",
    },
    {
        imageUrl: tailwindcss,
        name: "Tailwind CSS",
        type: "Frontend",
    },
    {
        imageUrl: react,
        name: "React.js",
        type: "Frontend",
    },
    {
        imageUrl: nodejs,
        name: "Node.js",
        type: "Backend",
    },
    {
        imageUrl: express,
        name: "Express.js",
        type: "Backend",
    },
    {
        imageUrl: mongodb,
        name: "MongoDB",
        type: "Database",
    },
    {
        imageUrl: git,
        name: "Git",
        type: "Version Control",
    },
    {
        imageUrl: github,
        name: "GitHub",
        type: "Version Control",
    }
];

export const education = [
    {
        title: "Bachelor of Technology (B.Tech) - CSE",
        company_name: "GLA University, Mathura",
        icon: gla,
        iconBg: "#accbe1",
        date: "2023 - 2027",
        points: [
            "Bachelor of Technology in Computer Science & Engineering at GLA University, Mathura (Graduation Year: 2027).",
            "Solid theoretical and practical foundation in core CS subjects: Data Structures & Algorithms (DSA), Object-Oriented Programming (OOPs), Database Management Systems (DBMS), Operating Systems (OS), and Computer Networks (CN).",
            "Active competitive programmer with 100+ problems solved on LeetCode, 100+ on Codeforces, and 5-Star badges in Java & Python on HackerRank.",
        ],
    },
];

export const certifications = [
    {
        title: "OCI 2025 Certified Generative AI & DevOps Professional",
        company_name: "Oracle Cloud Infrastructure",
        icon: oracle,
        iconBg: "#fbc3bc",
        date: "2025",
        points: [
            "Oracle OCI 2025 Certified Generative AI Professional - Skilled in LLMs, prompt engineering, and Cloud AI implementations.",
            "Oracle OCI 2025 Certified DevOps Professional - Proficient in cloud infrastructure, CI/CD automation, and modern deployment strategies.",
        ],
    },
    {
        title: "Cybersecurity Professional Certificate",
        company_name: "Coursera / Google",
        icon: google,
        iconBg: "#a2d2ff",
        date: "2025",
        points: [
            "Earned Google Cybersecurity Professional Certificate on Coursera.",
            "Specialized in threat detection, network security protocols, vulnerability assessments, and security compliance.",
        ],
    },
    {
        title: "Java & MERN Stack Certified",
        company_name: "Infosys Springboard",
        icon: infosys,
        iconBg: "#b7e4c7",
        date: "2024 - 2025",
        points: [
            "Java & Object-Oriented Programming Certified by Infosys Springboard.",
            "MERN Stack Certified by Infosys Springboard for full-stack web application development.",
        ],
    },
];

export const experiences = [...education, ...certifications];

export const socialLinks = [
    {
        name: 'Contact',
        iconUrl: contact,
        link: '/contact',
    },
    {
        name: 'GitHub',
        iconUrl: github,
        link: 'https://github.com/Omcs23',
    },
    {
        name: 'LinkedIn',
        iconUrl: linkedin,
        link: 'https://www.linkedin.com/in/om-sharma-88109b296',
    },
    {
        name: 'LeetCode',
        iconUrl: leetcode,
        link: 'https://leetcode.com/u/OmSharma152/',
    },
    {
        name: 'Codeforces',
        iconUrl: codeforces,
        link: 'https://codeforces.com/profile/OmSharma_cs',
    },
    {
        name: 'HackerRank',
        iconUrl: hackerrank,
        link: 'https://www.hackerrank.com/profile/iOmSharma52',
    },
    {
        name: 'Instagram',
        iconUrl: instagram,
        link: 'https://www.instagram.com/om.chaturvedi52?stkn=MTN4dDhjdm4xNGJtZg==',
    }
];

export const projects = [
    {
        iconUrl: hospital,
        theme: 'btn-back-blue',
        name: 'Hospital Management System',
        description: 'A comprehensive healthcare management web application designed to streamline patient registrations, doctor appointment scheduling, medical records, and hospital administrative operations. Built with Node.js, Express.js, MongoDB, Mongoose, JavaScript, HTML/CSS.',
        link: 'https://github.com/Omcs23/hospital-management-system',
    },
    {
        iconUrl: portfolio3d,
        theme: 'btn-back-red',
        name: '3D Interactive Portfolio',
        description: 'An immersive 3D developer portfolio website featuring interactive island 3D models, smooth camera navigation, dark/light ambient themes, and real-time coding stats. Built with React, Three.js, React Three Fiber, Tailwind CSS, JavaScript, HTML/CSS.',
        link: 'https://github.com/Omcs23/3d-portfolio',
    },
    {
        iconUrl: instagram,
        theme: 'btn-back-pink',
        name: 'Instagram Automation Bot (WIP)',
        description: 'An intelligent automation bot for Instagram comments and replies. Features user-configured comment triggers, automated context-aware replies, and background engagement handling.',
        link: 'https://github.com/Omcs23/instagram-automation-bot',
    }
];
