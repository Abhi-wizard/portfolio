import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { createParticleField } from './ParticleField';
import { loadGLBModel } from './GLBModel';
import { loadMagicMirror } from './MagicMirror';
import { assetUrl } from '../../utils/assetUrl';
import './MagicalCanvas.css';

/**
 * MagicalCanvas: Full 3D Interactive Exploration of Hogwarts Grand Hall
 * Supports Orbit, Pan, Zoom, WASD/Arrow Walking through the entrance into the hall,
 * and cinematic camera presets.
 */
const MagicalCanvas = () => {
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const {
    isLowPerformance,
    setLoadingProgress,
    entranceState,
    currentRealm,
    transitionToRealm
  } = useMagicalScene();

  const transitionToRealmRef = useRef(transitionToRealm);
  useEffect(() => {
    transitionToRealmRef.current = transitionToRealm;
  }, [transitionToRealm]);

  const mouse = useMouseParallax(0.04);
  const mouseRef = useRef(mouse);

  useEffect(() => {
    mouseRef.current = mouse;
  }, [mouse]);

  const entranceStateRef = useRef(entranceState);
  useEffect(() => {
    entranceStateRef.current = entranceState;
  }, [entranceState]);

  const currentRealmRef = useRef(currentRealm);
  useEffect(() => {
    currentRealmRef.current = currentRealm;
    if (containerRef.current) {
      // Only show Grand Hall 3D Canvas when in grand_hall realm and entered
      const isGrandHall = currentRealm === 'grand_hall' && entranceState === 'entered';
      containerRef.current.style.display = isGrandHall ? 'block' : 'none';
      containerRef.current.style.pointerEvents = isGrandHall ? 'auto' : 'none';

      // Reset camera to front facade position when entering grand_hall
      if (isGrandHall && cameraRef.current && controlsRef.current) {
        cameraRef.current.position.set(-13.0, 0.8, 0);
        controlsRef.current.target.set(0, 0.2, 0);
        controlsRef.current.update();
      }
    }
  }, [currentRealm, entranceState]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0806, 0.015);

    // 2. Camera setup with small near clipping plane to allow walking inside without clipping
    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.05,
      250
    );
    // Initial camera position facing the Grand Hall stained-glass front facade
    camera.position.set(-13.0, 0.8, 0);
    cameraRef.current = camera;

    // 3. High-Fidelity WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isLowPerformance,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowPerformance ? 1 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = !isLowPerformance;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Sketchfab-style OrbitControls (Rotate, Pan, Zoom, with free interior/exterior access)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.rotateSpeed = 0.85;
    controls.zoomSpeed = 0.95;
    controls.panSpeed = 0.85;
    controls.minDistance = 0.05; // Allows zooming all the way inside the Grand Hall
    controls.maxDistance = 30.0;
    controls.minPolarAngle = 0.05;
    controls.maxPolarAngle = Math.PI - 0.05;
    controls.target.set(0, 0, 0);
    controls.autoRotate = false;
    controlsRef.current = controls;

    // 5. Atmospheric Cinematic Lighting for Hogwarts Grand Hall
    const ambientLight = new THREE.AmbientLight(0xffecd2, 0.9);
    scene.add(ambientLight);

    // Grand Hall central chandeliers / floating candles warm light
    const hallWarmLight = new THREE.PointLight(0xffb703, 3.5, 30);
    hallWarmLight.position.set(0, 4.0, 0);
    hallWarmLight.castShadow = !isLowPerformance;
    scene.add(hallWarmLight);

    const warmFillLight = new THREE.PointLight(0xfb8500, 2.4, 20);
    warmFillLight.position.set(0, 1.8, 2.5);
    scene.add(warmFillLight);

    // High Table Dais Warm Light
    const daisLight = new THREE.PointLight(0xffd166, 2.8, 18);
    daisLight.position.set(0, 2.2, -3.0);
    scene.add(daisLight);

    // Stained glass cathedral window moonlight
    const moonWindowLight = new THREE.DirectionalLight(0x70a0d0, 1.8);
    moonWindowLight.position.set(-12, 16, 6);
    scene.add(moonWindowLight);

    const backRimLight = new THREE.DirectionalLight(0xd4af37, 1.0);
    backRimLight.position.set(12, 10, -10);
    scene.add(backRimLight);

    // 6. Floating Lumos Sparks & Ambient Arcane Dust
    const particleCount = isLowPerformance ? 250 : 650;
    const particleSystem = createParticleField(scene, particleCount);

    // 7. REAL 3D MODEL: Hogwarts Grand Hall (hogwarts_grand_hall.glb)
    const grandHallPath = assetUrl('/assets/models/hogwarts_grand_hall.glb');
    console.log('[MagicalCanvas] Loading Hogwarts Grand Hall from:', grandHallPath);

    const grandHallModel = loadGLBModel({
      modelPath: grandHallPath,
      scene,
      position: [0, -1.2, 0],
      rotation: [0, 0, 0],
      scale: 1,
      castShadow: true,
      receiveShadow: true,
      autoCenter: true,
      onProgress: (percent) => {
        setLoadingProgress(percent);
      },
      onLoad: ({ model, container: modelContainer }) => {
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        console.log('[MagicalCanvas] Hogwarts Grand Hall loaded successfully. Dimensions:', size, 'maxDim:', maxDim);

        if (maxDim > 0) {
          const targetScale = 14.0 / maxDim;
          modelContainer.scale.set(targetScale, targetScale, targetScale);
        }

        // Enable DoubleSide on all interior and exterior materials
        model.traverse((child) => {
          if (child.isMesh && child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                mat.side = THREE.DoubleSide;
                mat.shadowSide = THREE.DoubleSide;
              });
            } else {
              child.material.side = THREE.DoubleSide;
              child.material.shadowSide = THREE.DoubleSide;
            }
          }
        });

        setLoadingProgress(100);
      },
      onError: (err) => {
        console.error('[MagicalCanvas] Error loading Hogwarts Grand Hall GLB:', err?.message || err, err);
        setLoadingProgress(100);
      }
    });

    // 7b. REAL 3D MODEL: Magic Mirror (magic_mirror.glb) inside the Great Hall
    const magicMirror = loadMagicMirror({
      scene
    });

    // 8. Keyboard Navigation (WASD / Arrow Keys / Q / E) for Walking into the Grand Hall
    const keysPressed = {};
    const handleKeyDown = (e) => {
      if (currentRealmRef.current === 'grand_hall') {
        const k = e.key.toLowerCase();
        if (['w', 'a', 's', 'd', 'q', 'e', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
          keysPressed[k] = true;
        }
      }
    };

    const handleKeyUp = (e) => {
      const k = e.key.toLowerCase();
      keysPressed[k] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 8b. Real 3D Magic Mirror Raycasting & Pointer Interaction (Hover + Click)
    const raycaster = new THREE.Raycaster();
    const mouseCoords = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };
    let pointerDownTime = 0;
    let isPointerDragging = false;

    const handlePointerDown = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      pointerDownPos = { x: clientX, y: clientY };
      pointerDownTime = Date.now();
      isPointerDragging = false;
    };

    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (pointerDownTime > 0) {
        const dist = Math.hypot(clientX - pointerDownPos.x, clientY - pointerDownPos.y);
        if (dist > 7) {
          isPointerDragging = true;
        }
      }

      // Raycast hover check against Magic Mirror
      const rect = renderer.domElement.getBoundingClientRect();
      mouseCoords.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoords.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseCoords, camera);
      const mirrorTargets = magicMirror.getInteractiveObjects();
      if (mirrorTargets.length > 0) {
        const intersects = raycaster.intersectObjects(mirrorTargets, true);
        if (intersects.length > 0) {
          document.body.style.cursor = 'pointer';
          magicMirror.setHover(true);
        } else {
          document.body.style.cursor = 'auto';
          magicMirror.setHover(false);
        }
      }
    };

    const handlePointerUp = (e) => {
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
      const dist = Math.hypot(clientX - pointerDownPos.x, clientY - pointerDownPos.y);
      const elapsed = Date.now() - pointerDownTime;
      pointerDownTime = 0;

      // Genuine click/tap: minimal movement and short duration
      if (!isPointerDragging && dist < 10 && elapsed < 650) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouseCoords.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouseCoords.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouseCoords, camera);
        const mirrorTargets = magicMirror.getInteractiveObjects();
        if (mirrorTargets.length > 0) {
          const intersects = raycaster.intersectObjects(mirrorTargets, true);
          if (intersects.length > 0) {
            console.log('[MagicalCanvas] Magic Mirror 3D clicked! Transitioning to Pathway...');
            magicMirror.triggerClick();
            document.body.style.cursor = 'auto';
            if (transitionToRealmRef.current) {
              transitionToRealmRef.current('pathway');
            }
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    // 9. Camera Pose Interpolation Engine (for "Enter Grand Hall", "High Table", "Exterior" buttons)
    let camAnimation = null;

    const handleCameraGoto = (e) => {
      if (!e.detail) return;
      const { pos, target, duration = 1.4 } = e.detail;

      camAnimation = {
        startPos: camera.position.clone(),
        endPos: new THREE.Vector3(...pos),
        startTarget: controls.target.clone(),
        endTarget: new THREE.Vector3(...target),
        duration: duration,
        elapsed: 0
      };
    };

    window.addEventListener('magical-camera-goto', handleCameraGoto);

    // 10. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();
    const moveDir = new THREE.Vector3();
    const forwardVec = new THREE.Vector3();
    const rightVec = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Skip heavy 3D rendering when not on grand_hall scene
      if (currentRealmRef.current !== 'grand_hall' || entranceStateRef.current !== 'entered') {
        return;
      }

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Atmospheric candle flicker
      hallWarmLight.intensity = 3.3 + Math.sin(time * 5.5) * 0.4 + Math.sin(time * 12.0) * 0.2;
      daisLight.intensity = 2.6 + Math.sin(time * 4.0) * 0.3;

      // Handle Smooth Camera Glide Transitions
      if (camAnimation) {
        camAnimation.elapsed += delta;
        const progress = Math.min(camAnimation.elapsed / camAnimation.duration, 1.0);
        // Smooth cubic ease-in-out
        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        camera.position.lerpVectors(camAnimation.startPos, camAnimation.endPos, ease);
        controls.target.lerpVectors(camAnimation.startTarget, camAnimation.endTarget, ease);

        if (progress >= 1.0) {
          camAnimation = null;
        }
      }

      // Handle WASD / Arrow Walking
      moveDir.set(0, 0, 0);
      camera.getWorldDirection(forwardVec);
      forwardVec.y = 0; // Walk on horizontal plane
      forwardVec.normalize();
      rightVec.crossVectors(forwardVec, camera.up).normalize();

      const walkSpeed = 4.5;

      if (keysPressed['w'] || keysPressed['arrowup']) moveDir.add(forwardVec);
      if (keysPressed['s'] || keysPressed['arrowdown']) moveDir.sub(forwardVec);
      if (keysPressed['d'] || keysPressed['arrowright']) moveDir.add(rightVec);
      if (keysPressed['a'] || keysPressed['arrowleft']) moveDir.sub(rightVec);
      if (keysPressed['e']) moveDir.y += 1;
      if (keysPressed['q']) moveDir.y -= 1;

      if (moveDir.lengthSq() > 0) {
        moveDir.normalize().multiplyScalar(walkSpeed * delta);
        camera.position.add(moveDir);
        controls.target.add(moveDir);
      }

      // Update OrbitControls
      controls.update();

      const currentMouse = mouseRef.current;

      // Update particle field
      particleSystem.update(delta, currentMouse);

      // Update GLB Grand Hall model
      grandHallModel.update(delta, currentMouse);

      // Update GLB Magic Mirror model
      magicMirror.update(delta);

      renderer.render(scene, camera);
    };

    animate();

    // 11. Responsive Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 12. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('magical-camera-goto', handleCameraGoto);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      document.body.style.cursor = 'auto';
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      particleSystem.dispose();
      grandHallModel.dispose();
      magicMirror.dispose();
      controlsRef.current = null;
      cameraRef.current = null;
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isLowPerformance, setLoadingProgress]);

  return (
    <div
      ref={containerRef}
      className="magical-canvas-container"
      aria-hidden="true"
    >
      <button
        type="button"
        className="sr-only"
        onClick={() => transitionToRealm('pathway')}
        aria-label="Enter the Pathway through the Magic Mirror"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0
        }}
      >
        Enter the Pathway through the Magic Mirror
      </button>
    </div>
  );
};

export default MagicalCanvas;
