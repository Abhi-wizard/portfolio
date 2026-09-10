import React, { useState } from 'react';
import MirrorDiscoverySpell from '../ui/MirrorDiscoverySpell';
import MagicalInfoClue from '../ui/MagicalInfoClue';
import './GrandHallScene.css';

const GrandHallScene = () => {
  const [showMirrorClue, setShowMirrorClue] = useState(true);

  return (
    <section className="grandhall-scene-wrapper">
      <div className="grandhall-ambient-vignette" />

      {/* 1. Cinematic One-time "FIND THE MIRROR" Blue Spell Cast Sequence */}
      {showMirrorClue && (
        <MirrorDiscoverySpell onComplete={() => setShowMirrorClue(false)} />
      )}

      {/* 2. Top-Left Magical 'i' Information Button & Aged Parchment */}
      <MagicalInfoClue />
    </section>
  );
};

export default GrandHallScene;


