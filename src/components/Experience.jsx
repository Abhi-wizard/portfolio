import React from 'react';
import { experienceData } from '../data/portfolioData';
import { useMagicalScene } from '../context/MagicalSceneContext';
import { FaScroll, FaExternalLinkAlt } from 'react-icons/fa';
import './Experience.css';

const Experience = () => {
  const { openDocumentModal } = useMagicalScene();

  const handleOpenCert = (exp) => {
    if (!exp.certificateUrl) return;
    openDocumentModal({
      url: exp.certificateUrl,
      title: exp.certificateTitle || `${exp.company} — Certificate of Completion`,
      recipient: "TO: THE EVALUATION BOARD & MANAGEMENT",
      address: "EliteEikan Technologies LLC / Engineering Directorate",
      downloadName: "EliteEikan_Certificate.jpg",
      type: "certificate"
    });
  };

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
              {exp.certificateUrl && (
                <button
                  type="button"
                  className="exp-cert-btn"
                  onClick={() => handleOpenCert(exp)}
                  title="Click to view Certificate of Completion"
                >
                  <FaScroll />
                  <span>View Certificate of Completion</span>
                  <FaExternalLinkAlt />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
