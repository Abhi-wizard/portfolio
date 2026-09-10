import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MagicalInfoClue.css';

/**
 * MagicalInfoClue: Top-left magical 'i' information button that toggles
 * an authentic aged-yellow parchment clue directly beneath it.
 */
const MagicalInfoClue = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleParchment = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="magical-info-clue-root">
      {/* 1. Ornate Top-Left Magical 'i' Button */}
      <button
        type="button"
        onClick={toggleParchment}
        className={`magical-info-toggle-btn ${isOpen ? 'active-open' : ''}`}
        aria-expanded={isOpen}
        aria-label="Toggle Hogwarts Archival Clue Parchment"
        title="Archival Clue"
      >
        <span className="info-btn-glow" />
        <span className="info-btn-runic-border" />
        <span className="info-btn-icon">
          <span className="info-btn-symbol">i</span>
        </span>
      </button>

      {/* 2. Aged Yellow Parchment Document unfolding directly below */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="aged-parchment-doc"
            initial={{ opacity: 0, scaleY: 0.1, y: -15, originY: 0 }}
            animate={{
              opacity: 1,
              scaleY: 1,
              y: 0,
              transition: {
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            exit={{
              opacity: 0,
              scaleY: 0.08,
              y: -15,
              transition: {
                duration: 0.4,
                ease: [0.7, 0, 0.84, 0]
              }
            }}
            className="aged-parchment-container"
          >
            {/* Parchment Edge Texture & Seal Accents */}
            <div className="parchment-paper-body">
              <div className="parchment-inner-border" />
              <div className="parchment-corner top-left">✦</div>
              <div className="parchment-corner top-right">✦</div>
              <div className="parchment-corner bottom-left">✦</div>
              <div className="parchment-corner bottom-right">✦</div>

              <div className="parchment-header-seal">
                <span className="seal-emblem"> Hogwarts Archives </span>
              </div>

              <h3 className="parchment-main-title">FIND THE MIRROR</h3>

              <div className="parchment-divider-line" />

              <p className="parchment-clue-body">
                Find the mirror.
                <br />
                The path to the archives is hidden in its reflection.
              </p>

              <div className="parchment-footer-note">
                <span>✦ Touch the 3D mirror to reveal the passage ✦</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MagicalInfoClue;
