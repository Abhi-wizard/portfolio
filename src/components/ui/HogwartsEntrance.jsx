import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { assetUrl } from '../../utils/assetUrl';
import './HogwartsEntrance.css';

const HogwartsEntrance = () => {
  const { entranceState, enterArchives } = useMagicalScene();
  const mouse = useMouseParallax(0.03);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Initial reveal from pure dark
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleEnterClick = () => {
    if (entranceState === 'entrance') {
      enterArchives();
    }
  };

  if (entranceState === 'entered') {
    return null;
  }

  const isZooming = entranceState === 'zooming';

  return (
    <AnimatePresence>
      <div className={`hogwarts-entrance-wrapper ${isZooming ? 'zooming-active' : ''}`}>
        {/* Dark Obsidian Starter Fade */}
        <div className={`starter-dark-curtain ${revealed ? 'lifted' : ''}`} />

        {/* Full-Screen Responsive Hogwarts Entrance Image Layer */}
        <div
          className="hogwarts-image-container"
          style={{
            transform: `translate3d(${mouse.x * -18}px, ${mouse.y * -14}px, 0)`
          }}
        >
          <img
            src={assetUrl('/assets/images/hogwarts.jpg')}
            alt="Hogwarts Castle Entrance"
            className={`hogwarts-bg-image ${isZooming ? 'camera-zoom-in' : ''}`}
          />
        </div>

        {/* Atmospheric Moonlight & Fog Overlay Layers */}
        <div className="moonlight-ambient-layer" />
        <div className="drifting-fog-layer fog-back" />
        <div className="drifting-fog-layer fog-front" />
        <div className="cinematic-vignette-overlay" />

        {/* Floating Golden Sparks Overlay */}
        <div className="entrance-sparks-layer">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="entrance-spark"
              style={{
                left: `${(i * 5.5 + 4) % 96}%`,
                top: `${(i * 7.2 + 10) % 85}%`,
                animationDelay: `${(i * 0.45) % 4}s`,
                animationDuration: `${3.5 + (i % 3)}s`
              }}
            />
          ))}
        </div>

        {/* Central Entrance Gateway UI */}
        <div className={`entrance-ui-container ${isZooming ? 'fading-out' : ''}`}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : -20 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="entrance-crest-ring"
          >
            <span className="crest-sparkle">✦</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, letterSpacing: '12px' }}
            animate={{
              opacity: revealed ? 1 : 0,
              letterSpacing: revealed ? '4px' : '12px'
            }}
            transition={{ duration: 1.6, delay: 0.8 }}
            className="entrance-main-title"
          >
            THE HOGWARTS ARCHIVES
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: revealed ? 0.85 : 0 }}
            transition={{ duration: 1.4, delay: 1.1 }}
            className="entrance-subtitle"
          >
            Gateway to the magical archives & developer records
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{
              opacity: revealed ? 1 : 0,
              scale: revealed ? 1 : 0.9,
              y: revealed ? 0 : 15
            }}
            transition={{ duration: 1.2, delay: 1.3 }}
            whileHover={{
              scale: 1.06,
              boxShadow: '0 0 35px rgba(255, 215, 0, 0.95), 0 0 15px #fff'
            }}
            whileTap={{ scale: 0.96 }}
            onClick={handleEnterClick}
            className="enter-archives-cta-btn"
          >
            <span className="btn-glow-ring" />
            <span className="btn-label">ENTER THE ARCHIVES ✦</span>
          </motion.button>
        </div>

        {/* Warp Light Flash on Zoom Transition */}
        {isZooming && <div className="warp-light-flash" />}
      </div>
    </AnimatePresence>
  );
};

export default HogwartsEntrance;
