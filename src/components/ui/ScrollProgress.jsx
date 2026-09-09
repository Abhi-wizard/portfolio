import React from 'react';
import { motion } from 'framer-motion';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import './ScrollProgress.css';

const stages = [
  { id: 'hero', name: 'Courtyard' },
  { id: 'experience', name: 'Archives' },
  { id: 'skills', name: 'Spellbook' },
  { id: 'projects', name: 'Artifacts' },
  { id: 'achievements', name: 'Merlin' }
];

const ScrollProgress = () => {
  const { activeStage, setActiveStage, isNavigationActivated } = useMagicalScene();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveStage(id);
    }
  };

  return (
    <nav
      className={`magical-realm-nav ${isNavigationActivated ? 'awakened' : ''}`}
      aria-label="Magical realm navigation"
    >
      <motion.div
        className="realm-nav-track"
        animate={
          isNavigationActivated
            ? {
                boxShadow: [
                  '0 4px 20px rgba(0, 0, 0, 0.5)',
                  '0 0 30px rgba(255, 215, 0, 0.9), 0 0 50px rgba(255, 215, 0, 0.5)',
                  '0 4px 25px rgba(212, 175, 55, 0.6)'
                ],
                borderColor: ['rgba(212, 175, 55, 0.3)', '#ffd700', 'rgba(212, 175, 55, 0.6)']
              }
            : {}
        }
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        {stages.map((stage) => {
          const isActive = activeStage === stage.id;
          return (
            <button
              key={stage.id}
              className={`realm-nav-dot ${isActive ? 'active' : ''}`}
              onClick={() => scrollToSection(stage.id)}
              aria-label={`Scroll to ${stage.name}`}
            >
              <span className="dot-gem" />
              <span className="dot-tooltip">{stage.name}</span>
            </button>
          );
        })}
      </motion.div>
    </nav>
  );
};

export default ScrollProgress;
