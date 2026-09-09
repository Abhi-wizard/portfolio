/**
 * Centralized Single Source of Truth for Portfolio Content
 * Preserves 100% of existing user data, links, descriptions, and achievements.
 */

export const personalInfo = {
  name: "T. Abhimanyu",
  title: "Software Developer",
  summary:
    "Experienced in building scalable web applications, REST APIs, and database logic using Angular, React, Java, Spring Boot, and PostgreSQL.",
  profileImage: "/profile.jpg",
  resumePath: "/resume.pdf",
  socials: {
    linkedin: "https://www.linkedin.com/in/t-abhimanyu-112127281",
    github: "https://github.com/Abhi-wizard"
  }
};

export const experienceData = [
  {
    role: "Project Trainee",
    company: "EliteEikan Technologies LLC",
    duration: "January 2026 - July 2026",
    details: [
      "Built scalable backend services with Spring Boot and PostgreSQL utilizing Hibernate and Flyway, paired with a responsive Angular frontend.",
      "Engineered a Python/FastAPI microservice for OCR document extraction using PaddleOCR and Tesseract.",
      "Integrated secure workflows with GraphQL and Azure Auth, and implemented mass data processing using Apache POI."
    ]
  },
  {
    role: "Web Development Intern",
    company: "Prime Solutions",
    duration: "February 2024",
    details: [
      "Developed responsive web interfaces and improved UI design consistency across project deliverables."
    ]
  }
];

export const skillCategories = [
  {
    title: "Transfiguration (Frontend & Web)",
    skills: ["Angular", "React.js", "Kotlin", "Jetpack Compose", "HTML5", "CSS3", "JavaScript"]
  },
  {
    title: "Potions (Backend & Programming)",
    skills: ["Spring Boot", "Python FastAPI", "Node.js", "PHP", "Java", "Python"]
  },
  {
    title: "Ancient Runes (Databases)",
    skills: ["PostgreSQL", "MongoDB", "MySQL", "Firebase"]
  },
  {
    title: "The Forge (DevOps & Tools)",
    skills: ["Docker", "Kubernetes", "Terraform", "Maven"]
  },
  {
    title: "Magical Artifacts (AI / Tools)",
    skills: ["ChatGPT", "Claude", "Gemini 2.5 Pro API", "Prompt Engineering", "Git", "Android Studio"]
  }
];

export const projectData = [
  {
    id: "agriculture",
    title: "Empowering Agriculture",
    description:
      "PHP-MySQL e-commerce platform connecting farmers directly to customers for selling organic produce, featuring transparent pricing for rice, seeds, and millets.",
    techStack:
      "PHP, MySQL, Secure Payment Gateway (enhanced transaction efficiency by 40%)",
    imageFolder: "/projects/agriculture",
    images: []
  },
  {
    id: "kal",
    title: "Kal (Read and Learn)",
    description:
      "Android reading and learning platform integrating quizzes, rewards, and publishing with MVVM + Hilt architecture.",
    techStack:
      "Kotlin, Jetpack Compose, Firebase, Node.js, Gemini 2.5 Pro, Coroutines/Flow, Navigation",
    imageFolder: "/projects/kal",
    images: [
      "/projects/kal/1.png",
      "/projects/kal/2.png",
      "/projects/kal/3.png",
      "/projects/kal/4.png",
      "/projects/kal/5.png",
      "/projects/kal/6.png"
    ]
  },
  {
    id: "isaicraft",
    title: "IsaiCraft",
    description:
      "AI-powered neuro-acoustic music production platform with a custom soft-pitch correction algorithm and automated DSP mastering pipeline.",
    techStack:
      "React, FastAPI, Remote GPU Engine, Meta's MusicGen, Gemini 2.5 Pro (vocal coaching)",
    imageFolder: "/projects/isaicraft",
    images: [
      "/projects/isaicraft/isaicraft login.png",
      "/projects/isaicraft/isaicraft dashboard.png",
      "/projects/isaicraft/prompting.png",
      "/projects/isaicraft/live vocal record.png",
      "/projects/isaicraft/vocal recording.png",
      "/projects/isaicraft/production loading.png",
      "/projects/isaicraft/output.png"
    ]
  }
];

export const achievementsData = {
  education: [
    {
      title: "Master of Computer Applications (MCA)",
      institution: "Bharathiar University (2024-2026)",
      score: "Score: 70%",
      certificateUrl: "/certificates/mca_degree.pdf",
      actionText: "Click to reveal MCA scroll"
    },
    {
      title: "B.Sc. Computer Technology",
      institution: "Hindusthan College of Arts & Science (2021-2024)",
      score: "Score: 71%",
      certificateUrl: "/certificates/bsc_degree.pdf",
      actionText: "Click to reveal B.Sc. scroll"
    }
  ],
  certifications: [
    {
      name: "BI Dashboards with IBM Cognos Analytics & Google Looker (Coursera)",
      url: "/certificates/bi_dashboards.pdf"
    },
    {
      name: "Introduction to IoT (NPTEL)",
      url: "/certificates/iot.pdf"
    },
    {
      name: "Graphic Design with Photoshop (Great Learning)",
      url: "/certificates/photoshop.pdf"
    },
    {
      name: "Digital Image Processing (MathWorks)",
      url: "/certificates/image_processing.pdf"
    },
    {
      name: "Microsoft Power Platform Fundamentals",
      url: "/certificates/power_platform.pdf"
    }
  ],
  honors: [
    {
      name: '"5G Technology" Paper at Sri Ramakrishna College',
      url: "/certificates/5g_paper.pdf"
    },
    {
      name: '"Crop Yield Prediction Using ML" Paper at SRM Institute',
      url: "/certificates/crop_yield_paper.pdf"
    },
    {
      name: '"Performance of Transport Layer in WSN" Paper at PSGR Krishnammal College',
      url: "/certificates/transport_layer_wsn_paper.pdf"
    },
    {
      name: "Organizer & Magazine Editor for a National Level Technical Symposium",
      url: "/certificates/symposium_certificate.pdf"
    },
    {
      name: "Winner of the HIBOT Poster Designing Competition",
      url: "/certificates/hibot_award.pdf"
    }
  ]
};

export const modelCatalog = [
  {
    id: "snitch",
    name: "Golden Snitch",
    path: "/assets/models/harry_potter_-golden_snitch.glb",
    stage: "hero"
  },
  {
    id: "wand",
    name: "Elder Wand",
    path: "/assets/models/elder_wand.glb",
    stage: "hero"
  },
  {
    id: "grimoire",
    name: "Enchanted Grimoire",
    path: "/assets/models/enchanted_grimoire__stylized_magical_book.glb",
    stage: "skills"
  },
  {
    id: "books",
    name: "Magic Book Set",
    path: "/assets/models/magic_book_set.glb",
    stage: "skills"
  },
  {
    id: "grand_hall",
    name: "Hogwarts Grand Hall",
    path: "/assets/models/hogwarts_grand_hall.glb",
    stage: "experience"
  },
  {
    id: "dumbledore_office",
    name: "Dumbledore's Office",
    path: "/assets/models/dumbledores_office.glb",
    stage: "experience"
  },
  {
    id: "nimbus",
    name: "Nimbus 2000",
    path: "/assets/models/nimbus_2000_harry_potter_-_quidditch.glb",
    stage: "projects"
  },
  {
    id: "quidditch_cup",
    name: "Quidditch World Cup",
    path: "/assets/models/harry_potter_quidditch_world_cup.glb",
    stage: "achievements"
  },
  {
    id: "torch",
    name: "Gothic Torch",
    path: "/assets/models/stylized_gothic_wall_torch.glb",
    stage: "atmosphere"
  },
  {
    id: "owl",
    name: "Black Owl Familiar",
    path: "/assets/models/black_owl_familiar__amber-eyed_dark_fantasy.glb",
    stage: "atmosphere"
  }
];
