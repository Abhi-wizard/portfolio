import React from 'react';
import './Experience.css';

const experienceData = [
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

const Experience = () => {
  return (
    <section id="experience" className="experience-section">
      <h2 className="lumos-header">The Ministry of Magic Archives</h2>
      <div className="timeline">
        {experienceData.map((exp, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-content">
              <h3 className="role-title">{exp.role}</h3>
              <h4 className="company-name">{exp.company}</h4>
              <span className="duration">{exp.duration}</span>
              <ul className="details-list">
                {exp.details.map((detail, dIdx) => (
                  <li key={dIdx}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
