import React from 'react';
import Global3DLayer from './components/canvas/Global3DLayer';
import MagicalCanvas from './components/canvas/MagicalCanvas';
import MagicalNavArrows from './components/ui/MagicalNavArrows';
import WandCursor from './components/ui/WandCursor';
import ResumeOverlay from './components/ui/ResumeOverlay';
import SceneManager from './components/scenes/SceneManager';
import { MagicalSceneProvider } from './context/MagicalSceneContext';
import './index.css';

function PortfolioApp() {
  return (
    <div className="app-container">
      {/* 1. Grand Hall 3D Environment (Active only in Grand Hall) */}
      <MagicalCanvas />

      {/* 2. Global 3D Decoration & Elder Wand Cursor Layer (Active across ALL scenes) */}
      <Global3DLayer />

      {/* 3. Interactive Lumos Wand Cursor & Sparks */}
      <WandCursor />

      {/* 4. Realm Floating Runic Navigation Arrows */}
      <MagicalNavArrows />

      {/* 5. Independent Narrative Scene Controller */}
      <SceneManager />

      {/* 6. Same-Screen Magical Hogwarts Envelope Resume Viewer */}
      <ResumeOverlay />
    </div>
  );
}

function App() {
  return (
    <MagicalSceneProvider>
      <PortfolioApp />
    </MagicalSceneProvider>
  );
}

export default App;
