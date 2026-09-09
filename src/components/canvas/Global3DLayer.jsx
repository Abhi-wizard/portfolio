import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { createWandCursor3D } from './WandCursor3D';
import { createGoldenSnitchFlyer } from './GoldenSnitchFlyer';
import { createQuidditchFlyer } from './QuidditchFlyer';

/**
 * Global3DLayer: Persistent top-level 3D layer for the entire portfolio.
 * Renders the REAL Elder Wand (elder_wand.glb), Golden Snitch (harry_potter_-golden_snitch.glb),
 * and Quidditch World Cup Ball (harry_potter_quidditch_world_cup.glb) across ALL scenes
 * (Hogwarts Entrance, Grand Hall, Pathway, Inner Archive).
 */
const Global3DLayer = () => {
  const containerRef = useRef(null);
  const {
    activeSpell,
    onQuidditchObjectClick
  } = useMagicalScene();

  const mouse = useMouseParallax(0.04);
  const mouseRef = useRef(mouse);
  const wandCursorRef = useRef(null);

  useEffect(() => {
    mouseRef.current = mouse;
  }, [mouse]);

  // Trigger wand cast if activeSpell changes
  useEffect(() => {
    if (activeSpell && wandCursorRef.current) {
      wandCursorRef.current.castSpell();
    }
  }, [activeSpell]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup (Overlay coordinate space)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 5.5);

    // 2. High-Performance Transparent WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 3. Ambient & Directional Lighting for Wand & Flying Objects
    const ambientLight = new THREE.AmbientLight(0xfff6e0, 1.2);
    scene.add(ambientLight);

    const goldDirLight = new THREE.DirectionalLight(0xffdf80, 1.5);
    goldDirLight.position.set(5, 8, 5);
    scene.add(goldDirLight);

    const rimLight = new THREE.DirectionalLight(0x80b0ff, 0.8);
    rimLight.position.set(-5, -4, -2);
    scene.add(rimLight);

    // 4. REAL 3D ELDER WAND CURSOR (elder_wand.glb) - Always Top Layer across ALL screens
    const wandCursor = createWandCursor3D(scene, camera);
    wandCursor.setVisible(true);
    wandCursorRef.current = wandCursor;

    // 5. REAL 3D GOLDEN SNITCH (harry_potter_-golden_snitch.glb)
    const snitchFlyer = createGoldenSnitchFlyer(scene);

    // 6. REAL 3D QUIDDITCH WORLD CUP BALL (harry_potter_quidditch_world_cup.glb)
    const quidditchFlyer = createQuidditchFlyer(scene, onQuidditchObjectClick);

    // 7. Click Handling for Spell Cast & Snitch / Quidditch Raycasting
    const raycaster = new THREE.Raycaster();
    const clickCoords = new THREE.Vector2();

    const handleGlobalClick = (e) => {
      clickCoords.x = (e.clientX / window.innerWidth) * 2 - 1;
      clickCoords.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(clickCoords, camera);

      quidditchFlyer.checkClick(raycaster);
      wandCursor.castSpell();
    };

    window.addEventListener('click', handleGlobalClick);

    // 8. Animation Loop - Runs continuously on all screens
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const currentMouse = mouseRef.current;

      // Update Wand Cursor follow
      wandCursor.update(delta, currentMouse);

      // Update Flying Golden Snitch
      snitchFlyer.update(delta);

      // Update Flying Quidditch World Cup
      quidditchFlyer.update(delta);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 10. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleGlobalClick);
      cancelAnimationFrame(animationFrameId);
      wandCursor.dispose();
      snitchFlyer.dispose();
      quidditchFlyer.dispose();
      wandCursorRef.current = null;
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onQuidditchObjectClick]);

  return (
    <div
      ref={containerRef}
      className="global-3d-decoration-layer"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        pointerEvents: 'none',
        overflow: 'hidden',
        display: 'block'
      }}
      aria-hidden="true"
    />
  );
};

export default Global3DLayer;
