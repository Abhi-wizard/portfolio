import React from 'react';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import EntranceScene from './EntranceScene';
import GrandHallScene from './GrandHallScene';
import PathwayScene from './PathwayScene';
import InnerArchiveScene from './InnerArchiveScene';

export default function SceneManager() {
  const { entranceState, currentRealm, isTransitioningRealm } = useMagicalScene();

  if (entranceState !== 'entered') {
    return <EntranceScene />;
  }

  return (
    <div className="scene-viewport-container" style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      {/* Realm Transition Effect */}
      <div
        className={`realm-transition-curtain ${isTransitioningRealm ? 'active' : ''}`}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(247, 213, 139, 0.4), #030712 80%)',
          zIndex: 9999,
          pointerEvents: isTransitioningRealm ? 'all' : 'none',
          opacity: isTransitioningRealm ? 1 : 0,
          transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />

      {/* Independent Narrative Scenes */}
      {currentRealm === 'grand_hall' && <GrandHallScene />}
      {currentRealm === 'pathway' && <PathwayScene />}
      {currentRealm === 'pathway2' && <InnerArchiveScene />}
    </div>
  );
}
