import { assetUrl } from '../utils/assetUrl';

/**
 * Centralized Single Source of Truth for Portfolio Content
 * Preserves 100% of existing user data, links, descriptions, and achievements.
 */

export const personalInfo = {
  name: "T. Abhimanyu",
  title: "Software Developer",
  summary:
    "Experienced in building scalable web applications, REST APIs, and database logic using Angular, React, Java, Spring Boot, and PostgreSQL.",
  profileImage: assetUrl("/profile.jpg"),
  resumePath: assetUrl("/resume.pdf"),
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
    certificateUrl: assetUrl("/Eliteeikan/Eliteeikan certificate.jpg"),
    certificateTitle: "ELITEEIKAN TECHNOLOGIES — CERTIFICATE OF COMPLETION",
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
    imageFolder: assetUrl("/projects/Agriculture website"),
    images: [
      assetUrl("/projects/Agriculture website/project1 img1.png"),
      assetUrl("/projects/Agriculture website/project2 img2.png"),
      assetUrl("/projects/Agriculture website/project1 imgg3.png"),
      assetUrl("/projects/Agriculture website/project1 img4.png"),
      assetUrl("/projects/Agriculture website/project1 img5.png")
    ]
  },
  {
    id: "kal",
    title: "Kal (Read and Learn)",
    description:
      "Android reading and learning platform integrating quizzes, rewards, and publishing with MVVM + Hilt architecture.",
    techStack:
      "Kotlin, Jetpack Compose, Firebase, Node.js, Gemini 2.5 Pro, Coroutines/Flow, Navigation",
    imageFolder: assetUrl("/projects/kal"),
    images: [
      assetUrl("/projects/kal/1.png"),
      assetUrl("/projects/kal/2.png"),
      assetUrl("/projects/kal/3.png"),
      assetUrl("/projects/kal/4.png"),
      assetUrl("/projects/kal/5.png"),
      assetUrl("/projects/kal/6.png")
    ]
  },
  {
    id: "isaicraft",
    title: "IsaiCraft",
    description:
      "AI-powered neuro-acoustic music production platform with a custom soft-pitch correction algorithm and automated DSP mastering pipeline.",
    techStack:
      "React, FastAPI, Remote GPU Engine, Meta's MusicGen, Gemini 2.5 Pro (vocal coaching)",
    imageFolder: assetUrl("/projects/isaicraft"),
    images: [
      assetUrl("/projects/isaicraft/isaicraft login.png"),
      assetUrl("/projects/isaicraft/isaicraft dashboard.png"),
      assetUrl("/projects/isaicraft/prompting.png"),
      assetUrl("/projects/isaicraft/live vocal record.png"),
      assetUrl("/projects/isaicraft/vocal recording.png"),
      assetUrl("/projects/isaicraft/production loading.png"),
      assetUrl("/projects/isaicraft/output.png")
    ]
  }
];

export const achievementsData = {
  education: [
    {
      title: "Master of Computer Applications (MCA)",
      institution: "Bharathiar University (2024-2026)",
      score: "Score: 70%",
      certificateUrl: assetUrl("/certificates/mca_degree.pdf"),
      actionText: "Click to reveal MCA scroll",
      docTitle: "MASTER OF COMPUTER APPLICATIONS (MCA) — DEGREE SCROLL",
      recipient: "TO: THE ACADEMIC SENATE OF BHARATHIAR UNIVERSITY",
      address: "Department of Computer Applications, Coimbatore",
      downloadName: "Abhimanyu_MCA_Degree.pdf"
    },
    {
      title: "B.Sc. Computer Technology",
      institution: "Hindusthan College of Arts & Science (2021-2024)",
      score: "Score: 71%",
      certificateUrl: assetUrl("/certificates/bsc_degree.pdf"),
      actionText: "Click to reveal B.Sc. scroll",
      docTitle: "B.SC. COMPUTER TECHNOLOGY — DEGREE SCROLL",
      recipient: "TO: THE ACADEMIC COUNCIL & CONTROLLER OF EXAMINATIONS",
      address: "Hindusthan College of Arts & Science, Coimbatore",
      downloadName: "Abhimanyu_BSc_Degree.pdf"
    }
  ],
  certifications: [
    {
      name: "BI Dashboards with IBM Cognos Analytics & Google Looker (Coursera)",
      url: assetUrl("/certificates/bi_dashboards.pdf"),
      docTitle: "BI DASHBOARDS WITH IBM COGNOS & GOOGLE LOOKER",
      recipient: "TO: THE EVALUATION BOARD",
      address: "Coursera / IBM & Google Cloud Academy",
      downloadName: "BI_Dashboards_Coursera_Certificate.pdf"
    },
    {
      name: "Introduction to IoT (NPTEL)",
      url: assetUrl("/certificates/iot.pdf"),
      docTitle: "INTRODUCTION TO INTERNET OF THINGS (IOT)",
      recipient: "TO: NATIONAL PROGRAMME ON TECHNOLOGY ENHANCED LEARNING",
      address: "NPTEL / IIT Kharagpur Archive",
      downloadName: "IoT_NPTEL_Certificate.pdf"
    },
    {
      name: "Graphic Design with Photoshop (Great Learning)",
      url: assetUrl("/certificates/photoshop.pdf"),
      docTitle: "GRAPHIC DESIGN WITH ADOBE PHOTOSHOP",
      recipient: "TO: GREAT LEARNING ACADEMY",
      address: "Great Learning Verification Wing",
      downloadName: "Photoshop_GreatLearning_Certificate.pdf"
    },
    {
      name: "Digital Image Processing (MathWorks)",
      url: assetUrl("/certificates/image_processing.pdf"),
      docTitle: "DIGITAL IMAGE PROCESSING ESSENTIALS",
      recipient: "TO: MATHWORKS TRAINING & RESEARCH DIVISION",
      address: "MathWorks Academy / MATLAB",
      downloadName: "Image_Processing_MathWorks_Certificate.pdf"
    },
    {
      name: "Microsoft Power Platform Fundamentals",
      url: assetUrl("/certificates/power_platform.pdf"),
      docTitle: "MICROSOFT POWER PLATFORM FUNDAMENTALS",
      recipient: "TO: MICROSOFT CERTIFIED PROFESSIONAL GUILD",
      address: "Microsoft Learn Credential Services",
      downloadName: "Power_Platform_Microsoft_Certificate.pdf"
    }
  ],
  honors: [
    {
      id: "5g-paper",
      name: '"5G Technology" Paper at Sri Ramakrishna College',
      url: assetUrl("/paper presentation/5G TECHNOLOGY.pdf"),
      docTitle: "EMERGING TRENDS IN 5G TECHNOLOGY (RESEARCH PRESENTATION)",
      recipient: "TO: THE SCHOLARLY COUNCIL & CHAIRPERSONS",
      address: "Sri Ramakrishna College of Arts & Science / Symposium Archives",
      downloadName: "5G_TECHNOLOGY_Paper.pdf",
      type: "paper"
    },
    {
      id: "crop-yield-paper",
      name: '"Crop Yield Prediction Using ML" Paper at SRM Institute',
      url: assetUrl("/paper presentation/Crop Predication using ML.pdf"),
      docTitle: "CROP YIELD PREDICTION USING MACHINE LEARNING (RESEARCH PRESENTATION)",
      recipient: "TO: THE SCIENTIFIC & TECHNICAL REVIEW COMMITTEE",
      address: "SRM Institute of Science and Technology / National Symposium",
      downloadName: "Crop_Yield_Prediction_Using_ML.pdf",
      type: "paper"
    },
    {
      id: "wsn-paper",
      name: '"Performance of Transport Layer in WSN" Paper at PSGR Krishnammal College',
      url: assetUrl("/certificates/transport_layer_wsn_paper.pdf"),
      docTitle: "PERFORMANCE OF TRANSPORT LAYER IN WIRELESS SENSOR NETWORKS",
      recipient: "TO: THE DEPARTMENT OF COMPUTER SCIENCE & RESEARCH GUILD",
      address: "PSGR Krishnammal College for Women",
      downloadName: "Transport_Layer_WSN_Paper.pdf",
      type: "paper"
    },
    {
      id: "symposium-mag",
      name: "Organizer & Magazine Editor for a National Level Technical Symposium",
      url: assetUrl("/certificates/symposium_certificate.pdf"),
      docTitle: "NATIONAL LEVEL TECHNICAL SYMPOSIUM — EDITORIAL & LEADERSHIP MERIT",
      recipient: "TO: THE EXECUTIVE COMMITTEE & PATRONS",
      address: "National Level Technical Symposium Directorate",
      downloadName: "Symposium_Organizer_Certificate.pdf",
      type: "certificate"
    },
    {
      id: "poster-making",
      name: "College Level Poster Design Competitions",
      url: assetUrl("/Achivements/poster making/POSTER MAKING CERTIFICATE1.jpg"),
      images: [
        assetUrl("/Achivements/poster making/POSTER MAKING CERTIFICATE1.jpg"),
        assetUrl("/Achivements/poster making/poster making certificate1.jpeg"),
        assetUrl("/Achivements/poster making/poster making3.jpeg")
      ],
      docTitle: "COLLEGE LEVEL POSTER DESIGN COMPETITIONS — MERIT CERTIFICATES",
      recipient: "TO: THE DESIGN JURY & ACADEMIC EVALUATION COMMITTEE",
      address: "Department of Computer Technology / Inter-College Technical Fest",
      downloadName: "Poster_Design_Certificate.jpg",
      type: "award"
    }
  ]
};

export const modelCatalog = [
  {
    id: "snitch",
    name: "Golden Snitch",
    path: assetUrl("/assets/models/harry_potter_-golden_snitch.glb"),
    stage: "hero"
  },
  {
    id: "wand",
    name: "Elder Wand",
    path: assetUrl("/assets/models/elder_wand.glb"),
    stage: "hero"
  },
  {
    id: "grimoire",
    name: "Enchanted Grimoire",
    path: assetUrl("/assets/models/enchanted_grimoire__stylized_magical_book.glb"),
    stage: "skills"
  },
  {
    id: "books",
    name: "Magic Book Set",
    path: assetUrl("/assets/models/magic_book_set.glb"),
    stage: "skills"
  },
  {
    id: "grand_hall",
    name: "Hogwarts Grand Hall",
    path: assetUrl("/assets/models/hogwarts_grand_hall.glb"),
    stage: "experience"
  },
  {
    id: "dumbledore_office",
    name: "Dumbledore's Office",
    path: assetUrl("/assets/models/dumbledores_office.glb"),
    stage: "experience"
  },
  {
    id: "nimbus",
    name: "Nimbus 2000",
    path: assetUrl("/assets/models/nimbus_2000_harry_potter_-_quidditch.glb"),
    stage: "projects"
  },
  {
    id: "quidditch_cup",
    name: "Quidditch World Cup",
    path: assetUrl("/assets/models/harry_potter_quidditch_world_cup.glb"),
    stage: "achievements"
  },
  {
    id: "torch",
    name: "Gothic Torch",
    path: assetUrl("/assets/models/stylized_gothic_wall_torch.glb"),
    stage: "atmosphere"
  },
  {
    id: "owl",
    name: "Black Owl Familiar",
    path: assetUrl("/assets/models/black_owl_familiar__amber-eyed_dark_fantasy.glb"),
    stage: "atmosphere"
  }
];

