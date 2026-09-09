import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { personalInfo } from '../data/portfolioData';
import { useMagicalScene } from '../context/MagicalSceneContext';
import './Hero.css';

const Hero = () => {
  const { isNavigationActivated, castSpell, openResumeModal } = useMagicalScene();
  const [isPortraitHovered, setIsPortraitHovered] = useState(false);

  const handleManualCast = (e) => {
    castSpell('LUMOS_MAXIMA', { x: e.clientX, y: e.clientY });
  };

  return (
    <section id="hero" className="courtyard-hero-section">
      <div className="courtyard-ambient-overlay" />

      <div className="courtyard-inworld-container">
        {/* Magical Portrait Talisman (Real profile.jpg - No Fake 3D Humans) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: -25 }}
          animate={{
            opacity: 1,
            scale: isPortraitHovered ? 1.05 : 1,
            y: isPortraitHovered ? -8 : 0
          }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className={`enchanted-portrait-talisman ${isPortraitHovered ? 'hovered' : ''}`}
          onClick={handleManualCast}
          onMouseEnter={() => setIsPortraitHovered(true)}
          onMouseLeave={() => setIsPortraitHovered(false)}
          title="Click to Channel Lumos Maxima"
        >
          {/* Outer Rotating Arcane Rune Rings */}
          <div className="talisman-rune-orbit outer" />
          <div className="talisman-rune-orbit inner" />
          <div className="talisman-backlight-glow" />

          {/* Genuine Profile Portrait */}
          <div className="talisman-image-holder">
            <img
              src={personalInfo.profileImage}
              alt={personalInfo.name}
              className="talisman-portrait"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Floating Arcane Gem Indicator */}
          <div className="talisman-crest-gem">✦</div>
        </motion.div>

        {/* Environmental In-World Illuminated Typography */}
        <div className={`inworld-typography ${isPortraitHovered ? 'highlighted' : ''}`}>
          <motion.div
            initial={{ opacity: 0, letterSpacing: '8px' }}
            animate={{ opacity: 1, letterSpacing: '3px' }}
            transition={{ duration: 1.4, delay: 0.2 }}
            className="arcane-realm-badge"
          >
            ✦ THE FOUNTAIN ARCHIVES ✦
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.4, ease: 'easeOut' }}
            className="inworld-name"
          >
            T. ABHIMANYU
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="arcane-divider"
          >
            <span className="divider-flair">✦</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.7 }}
            className="inworld-profession"
          >
            {personalInfo.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.9 }}
            className="inworld-summary"
          >
            {personalInfo.summary}
          </motion.p>
        </div>

        {/* Runic Social Portals & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.1 }}
          className="inworld-actions"
        >
          <div className="runic-socials">
            <a
              href={personalInfo.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="runic-social-anchor"
              aria-label="LinkedIn Archive"
            >
              <FaLinkedin />
              <span className="runic-label">LinkedIn</span>
            </a>
            <a
              href={personalInfo.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="runic-social-anchor"
              aria-label="GitHub Repository"
            >
              <FaGithub />
              <span className="runic-label">GitHub</span>
            </a>
          </div>

          <div className="inworld-buttons">
            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                openResumeModal();
              }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(255, 215, 0, 0.7)' }}
              whileTap={{ scale: 0.97 }}
              className="enchanted-cta-btn secondary"
            >
              <span>View Resume</span>
            </motion.button>

            <motion.a
              href={personalInfo.resumePath}
              download="Abhimanyu_Resume.pdf"
              whileHover={{ scale: 1.04, boxShadow: '0 0 25px rgba(255, 215, 0, 0.9)' }}
              whileTap={{ scale: 0.97 }}
              className="enchanted-cta-btn primary"
            >
              <span>Download Resume ✦</span>
            </motion.a>
          </div>

          {/* Interactive Wand Guidance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isNavigationActivated ? 0 : 0.85 }}
            transition={{ duration: 0.8 }}
            className="wand-interaction-hint"
          >
            <span>✦ Hover & Click the 3D Elder Wand to Cast Lumos & Unlock Realms ✦</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
