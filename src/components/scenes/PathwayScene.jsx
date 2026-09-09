import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalInfo } from '../../data/portfolioData';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import './PathwayScene.css';

const PathwayScene = () => {
  const { currentRealm, castSpell } = useMagicalScene();
  const mouse = useMouseParallax(0.025);
  const [isHovered, setIsHovered] = useState(false);

  if (currentRealm !== 'pathway') {
    return null;
  }

  const handleManualCast = (e) => {
    castSpell('LUMOS_MAXIMA', { x: e.clientX, y: e.clientY });
  };

  return (
    <AnimatePresence>
      <motion.section
        className="pathway-scene-wrapper"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Full-Screen Responsive Pathway Background Image */}
        <div
          className="pathway-image-container"
          style={{
            transform: `translate3d(${mouse.x * -14}px, ${mouse.y * -10}px, 0)`
          }}
        >
          <img
            src="/assets/images/pathway.webp"
            alt="The Enchanted Pathway"
            className="pathway-bg-image"
          />
        </div>

        {/* Ambient Mist & Atmospheric Vignette */}
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

        {/* Central Identity Composition (Talisman + Name + Role + Slogan) */}
        <div className="pathway-chamber-container">
          {/* Enchanted Talisman Mirror (Real profile.jpg) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: -15 }}
            animate={{
              opacity: 1,
              scale: isHovered ? 1.05 : 1,
              y: isHovered ? -4 : 0
            }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className={`pathway-talisman ${isHovered ? 'hovered' : ''}`}
            onClick={handleManualCast}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title="Click to Channel Lumos"
          >
            <div className="talisman-backlight" />
            <div className="talisman-rune-ring outer" />
            <div className="talisman-rune-ring inner" />

            <div className="talisman-frame">
              <img
                src={personalInfo.profileImage}
                alt={personalInfo.name}
                className="talisman-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            <div className="talisman-gem">✦</div>
          </motion.div>

          {/* Identity Text Block */}
          <div className={`pathway-intro-content ${isHovered ? 'glowing' : ''}`}>
            <motion.div
              initial={{ opacity: 0, letterSpacing: '6px' }}
              animate={{ opacity: 1, letterSpacing: '2.5px' }}
              transition={{ duration: 1.0, delay: 0.15 }}
              className="pathway-badge"
            >
              ✦ HOGWARTS GRAND HALL CHAMBER ✦
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.3 }}
              className="pathway-name"
            >
              {personalInfo.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="pathway-divider"
            >
              <span className="divider-gem">✦</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.55 }}
              className="pathway-title"
            >
              {personalInfo.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.7 }}
              className="pathway-welcome-note"
            >
              Welcome to my digital sanctum. Explore the 3D Hogwarts Grand Hall or cast Lumos to navigate realms.
            </motion.p>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

export default PathwayScene;
