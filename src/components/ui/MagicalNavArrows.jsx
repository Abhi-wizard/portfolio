import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import './MagicalNavArrows.css';

const MagicalNavArrows = () => {
  const { currentRealm, transitionToRealm, entranceState } = useMagicalScene();

  if (entranceState !== 'entered') {
    return null;
  }

  return (
    <div className="magical-nav-arrows-container" aria-label="Magical realm navigation">
      <AnimatePresence>
        {/* Back Buttons */}
        {currentRealm === 'pathway' && (
          <motion.button
            key="back-to-grand-hall"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onClick={() => transitionToRealm('grand_hall')}
            className="magical-nav-btn prev-btn"
            title="Return to Grand Hall"
          >
            <div className="nav-btn-glow" />
            <FaChevronLeft className="nav-icon" />
            <span className="nav-label">GRAND HALL</span>
          </motion.button>
        )}

        {currentRealm === 'pathway2' && (
          <motion.button
            key="back-to-pathway"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onClick={() => transitionToRealm('pathway')}
            className="magical-nav-btn prev-btn"
            title="Return to Pathway"
          >
            <div className="nav-btn-glow" />
            <FaChevronLeft className="nav-icon" />
            <span className="nav-label">THE PATHWAY</span>
          </motion.button>
        )}

        {/* Forward Buttons */}

        {currentRealm === 'pathway' && (
          <motion.button
            key="forward-to-pathway2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onClick={() => transitionToRealm('pathway2')}
            className="magical-nav-btn next-btn"
            title="Travel to the Inner Archive"
          >
            <div className="nav-btn-glow" />
            <span className="nav-label">INNER ARCHIVE</span>
            <FaChevronRight className="nav-icon" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MagicalNavArrows;
