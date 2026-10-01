import { meta, shopify, starbucks, tesla, googleCybersecurityBadge, oracleGenaiBadge, oracleDevopsBadge, infosysBadge, infosysMernBadge, infosysDsaBadge, infosysJavaBadge } from "../assets/images";
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
        id: "cybersecurity",
        title: "Google Cybersecurity Professional Certificate",
        company_name: "Coursera / Google",
        icon: google,
        iconBg: "#a2d2ff",
        date: "2025",
        badgeImage: googleCybersecurityBadge,
        credentialUrl: "https://www.credly.com/go/HXqLmQjVQrZsof6mIq5lxw",
        issuer: "Google / Coursera",
        verificationPlatform: "Credly",
        skills: ["Threat Detection", "Python", "Linux", "SQL", "SIEM Tools", "IDS Mitigations"],
        points: [
            "Earned Google Cybersecurity Professional Certificate on Coursera.",
            "Specialized in threat detection, network security protocols, vulnerability assessments, and security compliance.",
            "Verified digital badge issued via Credly for foundational cybersecurity proficiency.",
        ],
    },
    {
        id: "oracle-genai",
        title: "OCI 2025 Certified Generative AI Professional",
        company_name: "Oracle University / OCI",
        icon: oracle,
        iconBg: "#fbc3bc",
        date: "August 25, 2025",
        validUntil: "August 25, 2027",
        certId: "102425908OCI25GAIOCP",
        badgeImage: oracleGenaiBadge,
        credentialUrl: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=AB51D3589B8A730D89D01BFA838465213AE3D1A34EBC19179BCB8B410729E76F",
        issuer: "Oracle University",
        verificationPlatform: "Oracle CertView",
        skills: ["LLMs", "OCI Generative AI", "RAG", "Semantic Search", "Vector Databases", "LangChain", "Prompt Engineering"],
        points: [
            "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional.",
            "Skilled in Large Language Models (LLMs), OCI Generative AI Service, Retrieval-Augmented Generation (RAG), and Vector Databases.",
            "Certified in building, tracing, evaluating, and deploying enterprise AI applications using LangChain and Python.",
        ],
    },
    {
        id: "oracle-devops",
        title: "OCI 2025 Certified DevOps Professional",
        company_name: "Oracle University / OCI",
        icon: oracle,
        iconBg: "#fbc3bc",
        date: "September 02, 2025",
        validUntil: "September 02, 2027",
        certId: "102393118OCI25DOPOCP",
        badgeImage: oracleDevopsBadge,
        credentialUrl: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=77239BE2EFA74EE53515E3048EC02DA80E14C537C456DD125D01128AD2F00FB3",
        issuer: "Oracle University",
        verificationPlatform: "Oracle CertView",
        skills: ["DevOps Pipelines", "OCI Infrastructure", "CI/CD Automation", "Containerization", "IaC", "Cloud Security"],
        points: [
            "Oracle Cloud Infrastructure 2025 Certified DevOps Professional.",
            "Proficient in core DevOps principles, CI/CD automation pipelines, and infrastructure deployment on Oracle Cloud.",
            "Experienced in mastering application development, automated testing, and cloud security protocols.",
        ],
    },
    {
        id: "infosys-springboard",
        title: "Java, DSA & MERN Stack Certified",
        company_name: "Infosys Springboard",
        icon: infosys,
        iconBg: "#b7e4c7",
        date: "2024 - 2025",
        credentialUrl: "https://verify.onwingspan.com",
        issuer: "Infosys Springboard",
        verificationPlatform: "Infosys Wingspan",
        skills: ["Java Foundation", "Data Structures & Algorithms", "OOPs", "MERN Stack", "Full-Stack Development"],
        points: [
            "Java Foundation Certification - Awarded by Infosys Springboard (Issued July 9, 2025).",
            "Data Structures and Algorithms using Java - Awarded by Infosys Springboard (Issued June 22, 2025).",
            "MERN Stack & Full-Stack Web Application Development Certified by Infosys Springboard.",
            "Official verification portal: Infosys Springboard (verify.onwingspan.com).",
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
