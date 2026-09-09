import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import './LoadingScreen.css';

const LoadingScreen = () => {
  const { isLoaded, setIsLoaded, loadingProgress } = useMagicalScene();
  const [displayPercent, setDisplayPercent] = useState(10);
  const [readyToEnter, setReadyToEnter] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayPercent((prev) => {
        if (prev < loadingProgress) {
          return prev + 1;
        }
        if (prev >= 100) {
          clearInterval(timer);
          setReadyToEnter(true);
          return 100;
        }
        return prev;
      });
    }, 20);

    return () => clearInterval(timer);
  }, [loadingProgress]);

  const handleEnter = () => {
    setIsLoaded(true);
  };

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          className="magical-loading-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.2, ease: 'easeInOut' } }}
        >
          <div className="loading-crest-wrapper">
            <motion.div
              className="magical-seal-ring"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            />
            <div className="magical-seal-core">
              <span className="magical-seal-symbol">⚡</span>
            </div>
          </div>

          <h2 className="loading-title">Unlocking The Archives</h2>
          <p className="loading-subtitle">Summoning spells, artifacts, and arcane records...</p>

          <div className="loading-bar-track">
            <motion.div
              className="loading-bar-fill"
              style={{ width: `${displayPercent}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          <span className="loading-percentage">{displayPercent}%</span>

          {readyToEnter ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(255, 215, 0, 0.9)' }}
              whileTap={{ scale: 0.95 }}
              className="enter-archives-btn"
              onClick={handleEnter}
            >
              Enter The Archives ✦
            </motion.button>
          ) : (
            <span className="casting-spell-text">Infusing with Lumos...</span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
