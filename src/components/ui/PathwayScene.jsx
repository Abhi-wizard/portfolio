import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { personalInfo } from '../../data/portfolioData';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { assetUrl } from '../../utils/assetUrl';
import './PathwayScene.css';

const PathwayScene = () => {
  const { currentRealm, transitionToRealm } = useMagicalScene();
  const mouse = useMouseParallax(0.025);

  if (currentRealm !== 'pathway') {
    return null;
  }

  const handleBasicDetailsClick = () => {
    transitionToRealm('pathway2');
  };

  return (
    <AnimatePresence>
      <motion.section
        className="pathway-scene-wrapper"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Full-Screen Responsive Pathway Image */}
        <div
          className="pathway-image-container"
          style={{
            transform: `translate3d(${mouse.x * -14}px, ${mouse.y * -10}px, 0)`
          }}
        >
          <img
            src={assetUrl('/assets/images/pathway.webp')}
            alt="The Enchanted Pathway"
            className="pathway-bg-image"
          />
        </div>

        {/* Ambient Atmospheric Layers: Mist, Moonlight & Vignette */}
        <div className="pathway-moonlight-sheen" />
        <div className="pathway-mist-layer mist-one" />
        <div className="pathway-mist-layer mist-two" />
        <div className="pathway-cinematic-vignette" />

        {/* Floating Arcane Embers */}
        <div className="pathway-embers-layer">
          {Array.from({ length: 15 }).map((_, i) => (
            <span
              key={i}
              className="pathway-ember"
              style={{
                left: `${(i * 6.8 + 8) % 94}%`,
                top: `${(i * 8.1 + 12) % 80}%`,
                animationDelay: `${(i * 0.5) % 3.5}s`,
                animationDuration: `${4.0 + (i % 3)}s`
              }}
            />
          ))}
        </div>

        {/* Personal Introduction Content Over Pathway */}
        <div className="pathway-content-container">
          <motion.div
            initial={{ opacity: 0, letterSpacing: '8px' }}
            animate={{ opacity: 1, letterSpacing: '3px' }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="pathway-realm-badge"
          >
            ✦ THE MOONLIT PATHWAY ✦
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="pathway-name-title"
          >
            {personalInfo.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.0, delay: 0.7 }}
            className="pathway-divider"
          >
            <span className="pathway-divider-spark">✦</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="pathway-profession-title"
          >
            {personalInfo.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.0 }}
            className="pathway-summary-text"
          >
            {personalInfo.summary}
          </motion.p>

          {/* Runic Social Links & Resumes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.2 }}
            className="pathway-actions-row"
          >
            <div className="pathway-social-links">
              <a
                href={personalInfo.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="pathway-runic-link"
              >
                <FaLinkedin />
                <span>LinkedIn</span>
              </a>
              <a
                href={personalInfo.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="pathway-runic-link"
              >
                <FaGithub />
                <span>GitHub</span>
              </a>
            </div>

            <div className="pathway-cta-buttons">
              <a
                href={personalInfo.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="pathway-cta-btn secondary"
              >
                <span>View Resume</span>
              </a>
              <a
                href={personalInfo.resumePath}
                download="Abhimanyu_Resume.pdf"
                className="pathway-cta-btn primary"
              >
                <span>Download Resume ✦</span>
              </a>
            </div>
          </motion.div>

          {/* Interactive BASIC DETAILS Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.4 }}
            className="basic-details-portal-container"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 215, 0, 0.9)' }}
              whileTap={{ scale: 0.96 }}
              onClick={handleBasicDetailsClick}
              className="basic-details-magical-btn"
            >
              <span className="btn-rune-left">⚡</span>
              <span className="btn-text">BASIC DETAILS ✦</span>
              <span className="btn-rune-right">⚡</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

export default PathwayScene;
