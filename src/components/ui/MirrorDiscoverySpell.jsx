import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import './MirrorDiscoverySpell.css';

/**
 * MirrorDiscoverySpell: Cinematic magical discovery sequence.
 * 
 * Timeline:
 * 0.0s - 0.45s: Wand tip subtle ignition / charging
 * 0.45s - 0.85s: 3D Elder Wand wave / casting flick
 * 0.85s - 1.55s: Blue magical sparks & energy spread across the Great Hall
 * 1.55s - 1.90s: Magic settles into a soft radiant aura
 * 1.90s - 6.25s: "FIND THE MIRROR" text emerges and remains continuously readable (~4.35s)
 * 6.25s - 7.20s: Text and energy smoothly dissolve
 * 7.20s: Component completely unmounts and cleans up
 */
const MirrorDiscoverySpell = ({ onComplete }) => {
  const { castSpell } = useMagicalScene();
  // 'ignition' -> 'wave' -> 'sparks' -> 'settling' -> 'text' -> 'dissipating' -> 'done'
  const [phase, setPhase] = useState('ignition');
  const onCompleteRef = useRef(onComplete);
  const castSpellRef = useRef(castSpell);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    castSpellRef.current = castSpell;
  }, [castSpell]);

  useEffect(() => {
    // 1. Phase 1 -> 2: Wand Wave (0.45s)
    const tWave = setTimeout(() => {
      setPhase('wave');
      // Trigger the 3D Elder Wand casting wave motion
      if (castSpellRef.current) {
        castSpellRef.current('find_mirror');
      }
    }, 450);

    // 2. Phase 2 -> 3: Blue Sparks & Energy Spread (0.85s)
    const tSparks = setTimeout(() => {
      setPhase('sparks');
    }, 850);

    // 3. Phase 3 -> 4: Magic Settles (1.55s)
    const tSettling = setTimeout(() => {
      setPhase('settling');
    }, 1550);

    // 4. Phase 4 -> 5: "FIND THE MIRROR" Banner Emerges (1.90s)
    const tText = setTimeout(() => {
      setPhase('text');
    }, 1900);

    // 5. Phase 5 -> 6: Dissipating (~4.35s visible duration: 1.90s -> 6.25s)
    const tDissolve = setTimeout(() => {
      setPhase('dissipating');
    }, 6250);

    // 6. Phase 6 -> 7: Complete Unmount & Cleanup (7.20s)
    const tEnd = setTimeout(() => {
      setPhase('done');
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, 7200);

    return () => {
      clearTimeout(tWave);
      clearTimeout(tSparks);
      clearTimeout(tSettling);
      clearTimeout(tText);
      clearTimeout(tDissolve);
      clearTimeout(tEnd);
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <div className="mirror-discovery-spell-layer" aria-hidden="true">
      {/* 1. Wand Tip Ignition Starburst (0.0s -> 0.85s) */}
      <AnimatePresence>
        {(phase === 'ignition' || phase === 'wave') && (
          <motion.div
            key="wand-ignition"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{
              opacity: phase === 'wave' ? 0.95 : 0.75,
              scale: phase === 'wave' ? 1.25 : 0.85
            }}
            exit={{ opacity: 0, scale: 1.6, filter: 'blur(12px)' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="wand-tip-ignition-node"
          >
            <div className="wand-ignition-core" />
            <div className="wand-ignition-halo" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Procedural Volumetric Blue Magic Beam / Conic Energy Ray (0.85s -> 7.2s) */}
      <AnimatePresence>
        {(phase === 'sparks' || phase === 'settling' || phase === 'text' || phase === 'dissipating') && (
          <motion.div
            key="magical-beam"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{
              opacity: phase === 'dissipating' ? 0 : (phase === 'sparks' ? 0.95 : 0.85),
              scale: phase === 'dissipating' ? 1.08 : 1,
              filter: phase === 'dissipating' ? 'blur(20px)' : 'blur(0px)'
            }}
            exit={{ opacity: 0, scale: 1.15, filter: 'blur(25px)' }}
            transition={{
              opacity: { duration: phase === 'dissipating' ? 1.2 : 0.6, ease: 'easeInOut' },
              scale: { duration: 0.7, ease: 'easeOut' },
              filter: { duration: 1.0, ease: 'easeInOut' }
            }}
            className="blue-spell-beam-container"
          >
            <div className="blue-spell-core-beam" />
            <div className="blue-spell-volumetric-cone" />
            <div className="blue-spell-shimmer-ring" />
            
            {/* Shimmering & Traveling Blue Energy Particles */}
            <div className="blue-spell-particles">
              {Array.from({ length: 28 }).map((_, i) => (
                <span
                  key={i}
                  className={`blue-sparkle ${phase === 'sparks' ? 'bursting' : ''}`}
                  style={{
                    left: `${35 + (i * 6.5) % 32}%`,
                    top: `${18 + (i * 8.5) % 62}%`,
                    animationDelay: `${(i * 0.08) % 1.2}s`,
                    animationDuration: `${1.4 + (i % 4) * 0.35}s`,
                    transform: `scale(${0.6 + (i % 4) * 0.25})`
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Arcane "FIND THE MIRROR" Cinematic Text Banner (1.90s -> 6.25s) */}
      <AnimatePresence>
        {phase === 'text' && (
          <motion.div
            key="mirror-clue-text"
            initial={{ opacity: 0, scale: 0.92, y: 14, filter: 'blur(8px)' }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: 'blur(0px)'
            }}
            exit={{
              opacity: 0,
              scale: 1.04,
              y: -8,
              filter: 'blur(10px)',
              transition: { duration: 0.85, ease: [0.4, 0, 0.2, 1] }
            }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
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
