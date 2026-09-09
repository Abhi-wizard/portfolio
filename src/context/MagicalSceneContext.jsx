import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STAGES } from './magicalStages';

export const MagicalSceneContext = createContext(null);

export const MagicalSceneProvider = ({ children }) => {
  const [activeStage, setActiveStage] = useState(STAGES.HERO);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(100);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [wandCursorEnabled, setWandCursorEnabled] = useState(true);
  const [activeSpell, setActiveSpell] = useState(null);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [isNavigationActivated, setIsNavigationActivated] = useState(false);
  const [capturedQuidditchItem, setCapturedQuidditchItem] = useState(null);

  // Realm Navigation: 'grand_hall' | 'pathway' | 'pathway2'
  const [currentRealm, setCurrentRealm] = useState('grand_hall');
  const [isTransitioningRealm, setIsTransitioningRealm] = useState(false);

  // Entrance Lifecycle: 'entrance' -> 'zooming' -> 'entered'
  const [entranceState, setEntranceState] = useState('entrance');

  // Magical Resume Modal Overlay State
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  // Mouse state for 3D parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const activateNavigation = useCallback(() => {
    setIsNavigationActivated(true);
  }, []);

  const enterArchives = useCallback(() => {
    setEntranceState('zooming');
    setTimeout(() => {
      setEntranceState('entered');
      setIsLoaded(true);
    }, 1600);
  }, []);

  const openResumeModal = useCallback(() => {
    setIsResumeOpen(true);
  }, []);

  const closeResumeModal = useCallback(() => {
    setIsResumeOpen(false);
  }, []);

  const transitionToRealm = useCallback((realmName) => {
    if (realmName === currentRealm || isTransitioningRealm) return;
    setIsTransitioningRealm(true);
    setTimeout(() => {
      setCurrentRealm(realmName);
      setIsTransitioningRealm(false);
    }, 800);
  }, [currentRealm, isTransitioningRealm]);

  const castSpell = useCallback((spellName, origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 }) => {
    setActiveSpell({ id: Date.now(), name: spellName, origin });
    setTimeout(() => {
      setActiveSpell(null);
    }, 1500);
  }, []);

  const onQuidditchObjectClick = useCallback((data) => {
    console.log('[Quidditch Object Captured!]:', data);
    setCapturedQuidditchItem({ id: Date.now(), data });
  }, []);

  // Check hardware and performance tier
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
      setWandCursorEnabled(false);
    }

    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = window.innerWidth < 768;
    if (cores < 4 || isMobile) {
      setIsLowPerformance(true);
    }
  }, []);

  return (
    <MagicalSceneContext.Provider
      value={{
        activeStage,
        setActiveStage,
        scrollProgress,
        setScrollProgress,
        isLoaded,
        setIsLoaded,
        loadingProgress,
        setLoadingProgress,
        isAudioMuted,
        setIsAudioMuted,
        wandCursorEnabled,
        setWandCursorEnabled,
        activeSpell,
        castSpell,
        isLowPerformance,
        setIsLowPerformance,
        isNavigationActivated,
        activateNavigation,
        currentRealm,
        setCurrentRealm,
        transitionToRealm,
        isTransitioningRealm,
        entranceState,
        enterArchives,
        onQuidditchObjectClick,
        capturedQuidditchItem,
        mousePos,
        setMousePos,
        isResumeOpen,
        openResumeModal,
        closeResumeModal
      }}
    >
      {children}
    </MagicalSceneContext.Provider>
  );
};

export const useMagicalScene = () => {
  const context = useContext(MagicalSceneContext);
  if (!context) {
    throw new Error('useMagicalScene must be used within a MagicalSceneProvider');
  }
  return context;
};
