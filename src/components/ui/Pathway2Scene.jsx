import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { personalInfo, experienceData, skillCategories } from '../../data/portfolioData';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { assetUrl } from '../../utils/assetUrl';
import './Pathway2Scene.css';

const Pathway2Scene = () => {
  const { currentRealm } = useMagicalScene();
  const mouse = useMouseParallax(0.025);

  if (currentRealm !== 'pathway2') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.section
        className="pathway2-scene-wrapper"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Full-Screen Responsive Pathway2 Image */}
        <div
          className="pathway2-image-container"
          style={{
            transform: `translate3d(${mouse.x * -16}px, ${mouse.y * -12}px, 0)`
          }}
        >
          <img
            src={assetUrl('/assets/images/pathway2.webp')}
            alt="The Inner Sanctuary Pathway"
            className="pathway2-bg-image"
          />
        </div>

        {/* Atmospheric Overlays: Moonlight, Drifting Mist & Vignette */}
        <div className="pathway2-moonlight-sheen" />
        <div className="pathway2-mist-layer mist-a" />
        <div className="pathway2-mist-layer mist-b" />
        <div className="pathway2-cinematic-vignette" />

        {/* Floating Arcane Embers */}
        <div className="pathway2-embers-layer">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="pathway2-ember"
              style={{
                left: `${(i * 5.8 + 6) % 94}%`,
                top: `${(i * 7.5 + 8) % 85}%`,
                animationDelay: `${(i * 0.4) % 3.5}s`,
                animationDuration: `${3.8 + (i % 3)}s`
              }}
            />
          ))}
        </div>

        {/* In-World Environmental Personal Archive Content */}
        <div className="pathway2-content-container">
          <motion.div
            initial={{ opacity: 0, letterSpacing: '8px' }}
            animate={{ opacity: 1, letterSpacing: '3px' }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="pathway2-realm-badge"
          >
            ✦ THE INNER ARCHIVE ✦
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="pathway2-main-title"
          >
            {personalInfo.name}
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="pathway2-profession-title"
          >
            {personalInfo.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="pathway2-bio-text"
          >
            {personalInfo.summary}
          </motion.p>

          {/* Environmental Runic Pillars of Expertise */}
          <div className="pathway2-pillars-grid">
            {/* Specialization Pillar */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.9 }}
              className="pathway2-runic-pillar"
            >
              <h3 className="pillar-header">✦ SPELLWORK & SPECIALIZATION</h3>
              <p className="pillar-desc">
                Architecting scalable web platforms, robust REST/GraphQL APIs, high-throughput microservices, and reactive frontends.
              </p>
              <div className="pillar-skills-row">
                {skillCategories.slice(0, 2).map((cat, idx) => (
                  <div key={idx} className="pillar-skill-group">
                    <span className="group-title">{cat.title.split(' ')[0]}:</span>
                    <span className="group-items">{cat.skills.slice(0, 4).join(', ')}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Career Archive Pillar */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.0 }}
              className="pathway2-runic-pillar"
            >
              <h3 className="pillar-header">✦ GUILD EXPERIENCE</h3>
              <div className="pillar-experience-list">
                {experienceData.map((exp, idx) => (
                  <div key={idx} className="pillar-exp-item">
                    <div className="exp-role-row">
                      <span className="exp-role">{exp.role}</span>
                      <span className="exp-company">@ {exp.company}</span>
                    </div>
                    <span className="exp-duration">{exp.duration}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Runic Social Portals & Resumes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.2 }}
            className="pathway2-actions-row"
          >
            <div className="pathway2-social-links">
              <a
                href={personalInfo.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="pathway2-runic-link"
              >
                <FaLinkedin />
                <span>LinkedIn</span>
              </a>
              <a
                href={personalInfo.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="pathway2-runic-link"
              >
                <FaGithub />
                <span>GitHub</span>
              </a>
            </div>

            <div className="pathway2-cta-buttons">
              <a
                href={personalInfo.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="pathway2-cta-btn secondary"
              >
                <span>View Resume</span>
              </a>
              <a
                href={personalInfo.resumePath}
                download="Abhimanyu_Resume.pdf"
                className="pathway2-cta-btn primary"
              >
                <span>Download Resume ✦</span>
              </a>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

export default Pathway2Scene;
