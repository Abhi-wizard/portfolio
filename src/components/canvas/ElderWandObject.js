import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { assetUrl } from '../../utils/assetUrl';

let dracoLoaderInstance = null;
const getDracoLoader = () => {
  if (!dracoLoaderInstance && typeof window !== 'undefined') {
    dracoLoaderInstance = new DRACOLoader();
    dracoLoaderInstance.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
  }
  return dracoLoaderInstance;
};


/**
 * Creates and manages the REAL 3D Elder Wand asset inside Three.js
 * @param {THREE.Scene} scene
 * @param {Function} onActivate Callback when wand cast spell is triggered
 * @returns {{ group: THREE.Group, update: (delta: number, mouse: {x: number, y: number}, isFocused: boolean, isIdentityHovered?: boolean) => void, castSpell: () => void, isCasting: () => boolean, getPosition: () => THREE.Vector3, dispose: () => void }}
 */
export const createElderWandObject = (scene, onActivate) => {
  const wandRoot = new THREE.Group();
  wandRoot.position.set(1.5, 0.1, 1.4);
  wandRoot.rotation.set(-0.2, -Math.PI / 4, 0.3);
  scene.add(wandRoot);

  const wandModelContainer = new THREE.Group();
  wandRoot.add(wandModelContainer);

  // 1. Tip Light Beacon
  const tipLight = new THREE.PointLight(0xffe680, 0, 15);
  tipLight.position.set(0.9, 0.2, 0);
  wandRoot.add(tipLight);

  // 2. Orbital Wand Aura Particles (pre-allocated buffer)
  const sparkCount = 60;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPositions = new Float32Array(sparkCount * 3);
  const sparkAngles = new Float32Array(sparkCount);
  const sparkRadii = new Float32Array(sparkCount);
  const sparkSpeeds = new Float32Array(sparkCount);
  const sparkYOffsets = new Float32Array(sparkCount);

  for (let i = 0; i < sparkCount; i++) {
    const i3 = i * 3;
    sparkAngles[i] = Math.random() * Math.PI * 2;
    sparkRadii[i] = Math.random() * 0.45 + 0.15;
    sparkSpeeds[i] = Math.random() * 1.5 + 0.8;
    sparkYOffsets[i] = (Math.random() - 0.5) * 0.8;

    sparkPositions[i3] = Math.cos(sparkAngles[i]) * sparkRadii[i];
    sparkPositions[i3 + 1] = sparkYOffsets[i];
    sparkPositions[i3 + 2] = Math.sin(sparkAngles[i]) * sparkRadii[i];
  }

  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));

  const sparkMat = new THREE.PointsMaterial({
    color: 0xffd700,
    size: 0.08,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
  wandRoot.add(sparkPoints);

  // 3. Shockwave Light Ring on Spell Cast
  const shockwaveGeo = new THREE.RingGeometry(0.1, 0.25, 32);
  shockwaveGeo.rotateX(Math.PI / 2);
  const shockwaveMat = new THREE.MeshBasicMaterial({
    color: 0xfff3a0,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide
  });
  const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
  shockwaveMesh.position.copy(tipLight.position);
  wandRoot.add(shockwaveMesh);

  // 4. Subtle Light Connection Beam toward Identity
  const beamGeo = new THREE.CylinderGeometry(0.015, 0.04, 2.5, 8);
  beamGeo.rotateZ(Math.PI / 2);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  });
  const beamMesh = new THREE.Mesh(beamGeo, beamMat);
  beamMesh.position.set(-0.4, 0.3, -0.4);
  beamMesh.rotation.set(0.2, 0.6, -0.4);
  wandRoot.add(beamMesh);

  // 5. Load the REAL GLB Model: elder_wand.glb
  let modelLoaded = false;
  let rawWandModel = null;
  const loader = new GLTFLoader();
  const draco = getDracoLoader();
  if (draco) loader.setDRACOLoader(draco);

  loader.load(
    assetUrl('/assets/models/elder_wand.glb'),
    (gltf) => {
      rawWandModel = gltf.scene;

      // Auto-center and normalize bounding box
      const box = new THREE.Box3().setFromObject(rawWandModel);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;

      // Scale appropriately to make it realistic and elegant
      const targetScale = 1.4 / maxDim;
      rawWandModel.scale.set(targetScale, targetScale, targetScale);
      rawWandModel.position.sub(center.multiplyScalar(targetScale));

      // Enable real PBR reflections and shadows
      rawWandModel.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.roughness = 0.65;
            child.material.metalness = 0.2;
          }
        }
      });

      wandModelContainer.add(rawWandModel);
      modelLoaded = true;
    },
    undefined,
    (err) => {
      console.error('[ElderWandObject] Error loading real elder_wand.glb:', err);
    }
  );

  // Animation States
  let focusProgress = 0; // 0 (idle) -> 1 (focused)
  let identityHoverProgress = 0;
  let isCasting = false;
  let castTimer = 0;
  let shockwaveScale = 0.1;
  let shockwaveOpacity = 0;
  let time = 0;

  const castSpell = () => {
    if (isCasting) return;
    isCasting = true;
    castTimer = 0;
    shockwaveScale = 0.2;
    shockwaveOpacity = 1;

    if (onActivate) {
      onActivate();
    }
  };

  const update = (delta = 0.016, mouse = { x: 0, y: 0 }, isFocused = false, isIdentityHovered = false) => {
    time += delta;

    // Smooth focus transition
    const targetFocus = isFocused ? 1 : 0;
    focusProgress += (targetFocus - focusProgress) * 0.06;

    // Smooth identity hover transition
    const targetIdHover = isIdentityHovered ? 1 : 0;
    identityHoverProgress += (targetIdHover - identityHoverProgress) * 0.06;

    // 1. Idle Floating vs Focused Posture
    const idleBob = Math.sin(time * 2.0) * 0.04;
    const idleTilt = Math.sin(time * 1.5) * 0.05;

    wandRoot.position.y = 0.1 + idleBob + focusProgress * 0.25;
    wandRoot.position.x = 1.5 - focusProgress * 0.4 - identityHoverProgress * 0.15;
    wandRoot.position.z = 1.4 + focusProgress * 0.3;

    // Rotation interpolation: tilted gently towards viewer when focused
    wandRoot.rotation.x = -0.2 + idleTilt - focusProgress * 0.2 + mouse.y * 0.15 - identityHoverProgress * 0.15;
    wandRoot.rotation.y = -Math.PI / 4 + time * 0.15 + focusProgress * 0.4 + mouse.x * 0.2 - identityHoverProgress * 0.3;
    wandRoot.rotation.z = 0.3 - focusProgress * 0.3;

    // 2. Wand Tip Light Flare & Connection Beam
    if (isCasting) {
      castTimer += delta;
      tipLight.intensity = Math.max(0, 12.0 - castTimer * 5.0);
      tipLight.color.setHex(0xffffff);

      // Expand shockwave
      shockwaveScale += delta * 15.0;
      shockwaveOpacity -= delta * 1.2;
      shockwaveMesh.scale.set(shockwaveScale, shockwaveScale, shockwaveScale);
      shockwaveMat.opacity = Math.max(0, shockwaveOpacity);

      if (castTimer > 2.0) {
        isCasting = false;
      }
    } else {
      const baseIntensity = Math.max(focusProgress, identityHoverProgress * 0.85);
      const targetIntensity = baseIntensity * (3.0 + Math.sin(time * 8.0) * 0.6);
      tipLight.intensity = THREE.MathUtils.lerp(tipLight.intensity, targetIntensity, 0.1);
      tipLight.color.setHex(0xffe680);
    }

    // Identity Connection Beam opacity
    beamMat.opacity = identityHoverProgress * (0.4 + Math.sin(time * 6) * 0.2);

    // 3. Orbital Particles Update
    const activeAura = Math.max(focusProgress, identityHoverProgress);
    sparkMat.opacity = THREE.MathUtils.lerp(sparkMat.opacity, activeAura * 0.85, 0.08);

    if (sparkMat.opacity > 0.01) {
      for (let i = 0; i < sparkCount; i++) {
        const i3 = i * 3;
        sparkAngles[i] += sparkSpeeds[i] * delta;
        sparkPositions[i3] = Math.cos(sparkAngles[i]) * sparkRadii[i];
        sparkPositions[i3 + 1] = sparkYOffsets[i] + Math.sin(time * 3 + i) * 0.1;
        sparkPositions[i3 + 2] = Math.sin(sparkAngles[i]) * sparkRadii[i];
      }
      sparkGeo.attributes.position.needsUpdate = true;
    }
  };

  const dispose = () => {
    scene.remove(wandRoot);
    sparkGeo.dispose();
    sparkMat.dispose();
    shockwaveGeo.dispose();
    shockwaveMat.dispose();
    beamGeo.dispose();
    beamMat.dispose();
    if (rawWandModel) {
      wandModelContainer.remove(rawWandModel);
    }
  };

  return {
    group: wandRoot,
    update,
    castSpell,
    isCasting: () => isCasting,
    getPosition: () => wandRoot.position,
    isLoaded: () => modelLoaded,
    dispose
  };
};
