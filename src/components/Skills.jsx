import React from 'react';
import './Skills.css';

const skillCategories = [
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

const Skills = () => {
  return (
    <section id="skills" className="skills-section">
      <h2 className="lumos-header">The Expanded Spellbook</h2>
      <div className="skills-grid">
        {skillCategories.map((category, idx) => (
          <div key={idx} className="skill-category">
            <h3 className="category-title">{category.title}</h3>
            <div className="skill-items">
              {category.skills.map((skill, sIdx) => (
                <div key={sIdx} className="skill-item floating-skill">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
