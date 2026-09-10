import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalInfo } from '../../data/portfolioData';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { assetUrl } from '../../utils/assetUrl';
import './PathwayScene.css';

/**
 * PathwayScene: Enchanted Diary Profile Reveal
 * 
 * Cinematic Sequence:
 * 1. 0.0s - 2.0s: "HI..." written in magical golden ink, holds, then dissolves into gold particles.
 * 2. 2.5s - 5.5s: Profile photo materializes from center darkness, moving forward with depth scale
 *                 (3-4s smooth forward travel) into its final centered position.
 * 3. 5.5s - 6.8s: "T. ABHIMANYU" writes progressively character-by-character with warm golden ink glow.
 * 4. 6.8s+: Upon completion, name transitions to a crisp, sharp, elegant presentation (no blur).
 * 5. 7.1s - 7.8s: "SOFTWARE DEVELOPER" title materializes with golden shimmer.
 * 6. 7.8s+: Description appears: "I transform ideas into intelligent digital experiences through code, creativity, and emerging AI."
 */
const TARGET_NAME = "T. ABHIMANYU";

const PathwayScene = () => {
  const { currentRealm, castSpell } = useMagicalScene();
  const mouse = useMouseParallax(0.025);
  const [isHovered, setIsHovered] = useState(false);

  // Phased Reveal State
  const [showHi, setShowHi] = useState(true);
  const [hiPhase, setHiPhase] = useState('visible'); // 'visible' -> 'dissolving' -> hidden
  const [showPhoto, setShowPhoto] = useState(false);
  const [photoPhase, setPhotoPhase] = useState('emerging'); // 'emerging' -> 'settled'
  const [showName, setShowName] = useState(false);
  const [displayedNameLength, setDisplayedNameLength] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [showDesc, setShowDesc] = useState(false);

  const isNameComplete = displayedNameLength >= TARGET_NAME.length;

  const timersRef = useRef([]);

  const addTimer = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  };

  useEffect(() => {
    // Phase 1: "HI..." stays for ~2.0s, then dissolves
    addTimer(() => {
      setHiPhase('dissolving');
    }, 2000);

    // Phase 2: Profile photo emerges at 2.5s (runs 3.0s until 5.5s)
    addTimer(() => {
      setShowHi(false);
      setShowPhoto(true);
      setPhotoPhase('emerging');
    }, 2500);

    // Phase 3: Photo settles at 5.5s -> Trigger progressive name reveal
    addTimer(() => {
      setPhotoPhase('settled');
      setShowName(true);
    }, 5500);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  // Progressive Ink Reveal for "T. ABHIMANYU"
  useEffect(() => {
    if (!showName) return;

    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex += 1;
      setDisplayedNameLength(charIndex);

      if (charIndex >= TARGET_NAME.length) {
        clearInterval(interval);
        // Phase 4: Title reveal after name finishes
        addTimer(() => {
          setShowTitle(true);
        }, 350);

        // Phase 5: Professional description reveal
        addTimer(() => {
          setShowDesc(true);
        }, 900);
      }
    }, 85);

    return () => clearInterval(interval);
  }, [showName]);

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
            src={assetUrl('/assets/images/pathway.webp')}
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

        {/* ================================================================ */}
        {/* PHASE 1: MAGICAL "HI..." ENCHANTED WRITING                       */}
        {/* ================================================================ */}
        <AnimatePresence>
          {showHi && (
            <motion.div
              key="magical-hi-stage"
              className="magical-hi-stage"
              initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
              animate={{
                opacity: hiPhase === 'dissolving' ? 0 : 1,
                scale: hiPhase === 'dissolving' ? 1.25 : 1,
                filter: hiPhase === 'dissolving' ? 'blur(16px)' : 'blur(0px)'
              }}
              exit={{ opacity: 0, scale: 1.3, filter: 'blur(20px)' }}
              transition={{
                duration: hiPhase === 'dissolving' ? 0.55 : 0.7,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <div className="magical-hi-text">HI...</div>
              <div className="magical-hi-glow" />

              {/* Floating Gold Ink Particles */}
              <div className="hi-ink-particles">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span
                    key={i}
                    className={`hi-spark ${hiPhase === 'dissolving' ? 'scatter' : ''}`}
                    style={{
                      left: `${25 + (i * 7.5) % 55}%`,
                      top: `${15 + (i * 9.8) % 70}%`,
                      animationDelay: `${(i * 0.1) % 0.9}s`
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================================================================ */}
        {/* CENTRAL IDENTITY CHAMBER (PHOTO + PROGRESSIVE WRITING)           */}
        {/* ================================================================ */}
        <div className="pathway-chamber-container">
          {/* PHASE 2: Profile Photo Materialization (Center forward travel 3-4s) */}
          {showPhoto && (
            <motion.div
              key="pathway-talisman-profile"
              initial={{ opacity: 0, scale: 0.15, y: 30, filter: 'blur(16px)' }}
              animate={{
                opacity: 1,
                scale: isHovered ? 1.05 : 1,
                y: isHovered ? -4 : 0,
                filter: 'blur(0px)'
              }}
              transition={{
                duration: 3.0,
                ease: [0.16, 1, 0.3, 1]
              }}
              className={`pathway-talisman ${isHovered ? 'hovered' : ''} ${
                photoPhase === 'emerging' ? 'emerging' : ''
              }`}
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

              {/* Orbiting Golden Emergence Sparks during forward travel */}
              {photoPhase === 'emerging' && (
                <div className="photo-orbit-sparks">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span
                      key={i}
                      className="orbit-spark"
                      style={{
                        animationDelay: `${i * 0.25}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Identity Text Block (Appears sequentially after photo arrives) */}
          {showPhoto && (
            <div className={`pathway-intro-content ${isHovered ? 'glowing' : ''}`}>
              {/* PHASE 3: Progressive Magical Name Reveal */}
              {showName && (
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`pathway-name magical-ink-writing ${
                    isNameComplete ? 'revealed-name' : 'revealing-name'
                  }`}
                >
                  <span className="ink-revealed-text">
                    {TARGET_NAME.slice(0, displayedNameLength)}
                  </span>
                  {!isNameComplete && (
                    <span className="ink-quill-glow" />
                  )}
                </motion.h1>
              )}

              {/* Gold Rune Divider */}
              {showTitle && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="pathway-divider"
                >
                  <span className="divider-gem">✦</span>
                </motion.div>
              )}

              {/* PHASE 4: Profession Title */}
              {showTitle && (
                <motion.h2
                  initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="pathway-title"
                >
                  SOFTWARE DEVELOPER
                </motion.h2>
              )}

              {/* PHASE 5: Professional Description */}
              {showDesc && (
                <motion.p
                  initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="pathway-welcome-note"
                >
                  I transform ideas into intelligent digital experiences through code, creativity, and emerging AI.
                </motion.p>
              )}
            </div>
          )}
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

export default PathwayScene;
