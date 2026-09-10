import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import './MirrorDiscoverySpell.css';

/**
 * MirrorDiscoverySpell: Procedural blue magic beam and cinematic "FIND THE MIRROR"
 * clue cast by the Elder Wand upon entering the Hogwarts Grand Hall.
 */
const MirrorDiscoverySpell = ({ onComplete }) => {
  const { castSpell } = useMagicalScene();
  const [phase, setPhase] = useState('charging'); // 'charging' -> 'beam' -> 'text' -> 'dissipating' -> 'done'

  useEffect(() => {
    // 1. Trigger the Elder Wand 3D cast action
    castSpell('find_mirror');

    // 2. Exact timeline sequence
    // 0.0s - 0.4s: Blue arcane energy starts forming at wand tip
    const tBeam = setTimeout(() => {
      setPhase('beam');
    }, 400);

    // 0.8s: "FIND THE MIRROR" text emerges within the blue radiance
    const tText = setTimeout(() => {
      setPhase('text');
    }, 850);

    // 2.1s: Text begins dissolving
    const tDissolve = setTimeout(() => {
      setPhase('dissipating');
    }, 2100);

    // 2.9s: Energy fully dissipates into the Great Hall atmosphere
    const tEnd = setTimeout(() => {
      setPhase('done');
      if (onComplete) onComplete();
    }, 2900);

    return () => {
      clearTimeout(tBeam);
      clearTimeout(tText);
      clearTimeout(tDissolve);
      clearTimeout(tEnd);
    };
  }, [castSpell, onComplete]);

  if (phase === 'done') return null;

  return (
    <div className="mirror-discovery-spell-layer" aria-hidden="true">
      {/* 1. Procedural Volumetric Blue Magic Beam / Conic Energy Ray */}
      <AnimatePresence>
        {(phase === 'beam' || phase === 'text') && (
          <motion.div
            key="magical-beam"
            initial={{ opacity: 0, scaleY: 0.2, scaleX: 0.5 }}
            animate={{
              opacity: phase === 'text' ? [0.85, 1, 0.9] : 0.85,
              scaleY: 1,
              scaleX: 1
            }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="blue-spell-beam-container"
          >
            <div className="blue-spell-core-beam" />
            <div className="blue-spell-volumetric-cone" />
            <div className="blue-spell-shimmer-ring" />
            
            {/* Shimmering Blue Energy Particles */}
            <div className="blue-spell-particles">
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className="blue-sparkle"
                  style={{
                    left: `${40 + (i * 7) % 22}%`,
                    top: `${20 + (i * 9) % 55}%`,
                    animationDelay: `${(i * 0.12) % 1.2}s`,
                    animationDuration: `${1.4 + (i % 3) * 0.3}s`,
                    transform: `scale(${0.6 + (i % 4) * 0.25})`
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Arcane "FIND THE MIRROR" Cinematic Text Banner */}
      <AnimatePresence>
        {phase === 'text' && (
          <motion.div
            key="mirror-clue-text"
            initial={{ opacity: 0, scale: 0.85, y: 15, filter: 'blur(10px)' }}
            animate={{
              opacity: 1,
              scale: [0.85, 1.04, 1.0],
              y: 0,
              filter: 'blur(0px)'
            }}
            exit={{
              opacity: 0,
              scale: 1.08,
              y: -10,
              filter: 'blur(12px)',
              transition: { duration: 0.45, ease: 'easeInOut' }
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mirror-clue-banner"
          >
            <div className="clue-rune-flourish top">✦ &nbsp; • &nbsp; ✧ &nbsp; • &nbsp; ✦</div>
            <h2 className="clue-title-text">FIND THE MIRROR</h2>
            <div className="clue-sub-glow">THE PATHWAY AWAITS WITHIN ITS GLASS</div>
            <div className="clue-rune-flourish bottom">✦ &nbsp; • &nbsp; ✧ &nbsp; • &nbsp; ✦</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MirrorDiscoverySpell;
