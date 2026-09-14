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
        imageUrl: mongodb,
        name: "MongoDB",
        type: "Database",
    },
    {
        imageUrl: express,
        name: "Express",
        type: "Backend",
    },
    {
        imageUrl: react,
        name: "React",
        type: "Frontend",
    },
    {
        imageUrl: nodejs,
        name: "Node.js",
        type: "Backend",
    },
    {
        imageUrl: java,
        name: "Java",
        type: "Programming Language",
    },
    {
        imageUrl: python,
        name: "Python",
        type: "Programming Language",
    }
];

export const experiences = [
    {
        title: "B.Tech Computer Science & Engineering",
        company_name: "GLA University",
        icon: gla,
        iconBg: "#accbe1",
        date: "2022 - 2026",
        points: [
            "Pursuing Bachelor of Technology in Computer Science & Engineering at GLA University.",
            "Driven by creativity and a strong passion for full-stack engineering, AI automation, and interactive web tools.",
            "Solid foundations in Data Structures, Algorithms, Software Engineering, and Database Management Systems.",
            "Active competitive programmer on LeetCode and Codeforces, consistently honing problem-solving capabilities.",
        ],
    },
    {
        title: "OCI 2025 Certified Generative AI & DevOps Professional",
        company_name: "Oracle Cloud Infrastructure",
        icon: oracle,
        iconBg: "#fbc3bc",
        date: "2025",
        points: [
            "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional - Expertise in LLMs, prompt engineering, and cloud AI solutions.",
            "Oracle Cloud Infrastructure 2025 Certified DevOps Professional - Proficient in cloud infrastructure automation, CI/CD pipelines, and microservices.",
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
            "Mastered network security protocols, vulnerability assessment, threat analysis, incident response, and secure API integration.",
        ],
    },
    {
        title: "Java & MERN Stack Certifications",
        company_name: "Infosys Springboard",
        icon: infosys,
        iconBg: "#b7e4c7",
        date: "2024 - 2025",
        points: [
            "Certified in Java Programming & Object-Oriented Software Design.",
            "Certified in MERN Stack Development (MongoDB, Express.js, React.js, Node.js) for end-to-end web applications.",
        ],
    },
];

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
    }
];

export const projects = [
    {
        iconUrl: hospital,
        theme: 'btn-back-blue',
        name: 'Hospital Management System',
        description: 'A comprehensive healthcare management web application designed to streamline patient registrations, doctor appointment scheduling, medical records, and hospital administrative operations.',
        link: 'https://github.com/Omcs23/hospital-management-system',
    },
    {
        iconUrl: instagram,
        theme: 'btn-back-pink',
        name: 'Instagram Automation Bot (WIP)',
        description: 'An intelligent automation bot for Instagram comments and replies. Features user-configured comment triggers, automated context-aware replies, and background engagement handling.',
        link: 'https://github.com/Omcs23/instagram-automation-bot',
    },
    {
        iconUrl: portfolio3d,
        theme: 'btn-back-red',
        name: '3D Interactive Portfolio',
        description: 'An immersive 3D developer portfolio website built with React, Three.js, React Three Fiber, and Tailwind CSS featuring interactive island models.',
        link: 'https://github.com/Omcs23/3d-portfolio',
    }
];