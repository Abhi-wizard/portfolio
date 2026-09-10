import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { assetUrl } from '../../utils/assetUrl';

/**
 * MAGIC_MIRROR_CONFIG
 * Derived directly from the Hogwarts Grand Hall geometric analysis:
 * - Central Staircase / Landing Centerline: Z = -0.2104
 * - Central Landing Floor Level: Y = -3.321
 * - Landing X-depth: X = -2.35 (centered on landing platform in front of back wall at X = -3.32)
 * - Orientation: Rotation Y = +PI/2 (+90 deg) facing into the Great Hall / towards approaching viewer
 * - Scale: Uniform 0.007 (proportional mirror height of ~2.0 units inside ~7.0 unit hall)
 */
export const MAGIC_MIRROR_CONFIG = {
  modelPath: '/assets/models/magic_mirror.glb',
  position: [-2.35, -3.321, -0.2104],
  rotation: [0, Math.PI / 2, 0],
  scale: 0.007,
  floorHeight: -3.321,
  castShadow: true,
  receiveShadow: true
};

let dracoLoaderInstance = null;
const getDracoLoader = () => {
  if (!dracoLoaderInstance && typeof window !== 'undefined') {
    dracoLoaderInstance = new DRACOLoader();
    dracoLoaderInstance.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
  }
  return dracoLoaderInstance;
};

/**
 * Loads the real 3D Magic Mirror GLB directly into the same Three.js scene as the Great Hall.
 * Handles automatic floor contact calculation, orientation, material setup, and lifecycle.
 *
 * @param {Object} options
 * @param {THREE.Scene} options.scene - The parent Three.js scene
 * @param {Array<number>} [options.position]
 * @param {Array<number>} [options.rotation]
 * @param {number|Array<number>} [options.scale]
 * @param {number} [options.floorHeight]
 * @param {boolean} [options.castShadow]
 * @param {boolean} [options.receiveShadow]
 * @param {Function} [options.onLoad]
 * @param {Function} [options.onError]
 * @returns {{ container: THREE.Group, update: Function, dispose: Function }}
 */
export const loadMagicMirror = ({
  scene,
  position = MAGIC_MIRROR_CONFIG.position,
  rotation = MAGIC_MIRROR_CONFIG.rotation,
  scale = MAGIC_MIRROR_CONFIG.scale,
  floorHeight = MAGIC_MIRROR_CONFIG.floorHeight,
  castShadow = MAGIC_MIRROR_CONFIG.castShadow,
  receiveShadow = MAGIC_MIRROR_CONFIG.receiveShadow,
  onLoad,
  onError
}) => {
  const resolvedPath = assetUrl(MAGIC_MIRROR_CONFIG.modelPath);
  const container = new THREE.Group();
  container.name = 'MagicMirror_Container';
  scene.add(container);

  // Apply initial container position and rotation
  container.position.set(position[0], position[1], position[2]);
  container.rotation.set(rotation[0], rotation[1], rotation[2]);

  const uniformScale = typeof scale === 'number' ? scale : (scale[0] || 0.007);
  container.scale.set(uniformScale, uniformScale, uniformScale);

  let modelInstance = null;
  let mixer = null;
  let isDisposed = false;

  const loader = new GLTFLoader();
  const dracoLoader = getDracoLoader();
  if (dracoLoader) {
    loader.setDRACOLoader(dracoLoader);
  }

  loader.load(
    resolvedPath,
    (gltf) => {
      if (isDisposed) return;

      modelInstance = gltf.scene;
      modelInstance.name = 'MagicMirror_Model';

      // 1. Calculate bounding box of raw model to perform exact floor contact offset
      const rawBox = new THREE.Box3().setFromObject(modelInstance);
      const rawMinY = rawBox.min.y;
      const rawCenter = rawBox.getCenter(new THREE.Vector3());

      // Center model along local X axis and align bottom to local Y = 0
      modelInstance.position.x = -rawCenter.x;
      modelInstance.position.y = -rawMinY;
      modelInstance.position.z = -rawCenter.z;

      // When container is placed at Y = floorHeight, the bottom of the mirror precisely touches floorHeight
      container.position.y = floorHeight;

      // 2. Configure materials and shadows
      modelInstance.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = castShadow;
          child.receiveShadow = receiveShadow;

          if (child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((mat) => {
              mat.side = THREE.DoubleSide;
              mat.depthWrite = true;
              if (mat.name === 'Mirror') {
                // Enhance reflective properties for magic mirror surface
                mat.roughness = 0.08;
                mat.metalness = 0.92;
              } else {
                mat.roughness = Math.min(mat.roughness ?? 0.5, 0.7);
                mat.metalness = Math.max(mat.metalness ?? 0.3, 0.5);
              }
            });
          }
        }
      });

      container.add(modelInstance);

      // 3. Subtle magical ambient glow point light on the mirror face
      const mirrorGlowLight = new THREE.PointLight(0xb8c0ff, 1.2, 3.5);
      mirrorGlowLight.position.set(0, 140, 30); // in local scaled model coordinates
      modelInstance.add(mirrorGlowLight);
      glowLightRef = mirrorGlowLight;

      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(modelInstance);
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });
      }

      console.log('[MagicMirror] Magic Mirror loaded and placed at landing floor:', {
        worldPosition: container.position,
        worldRotation: container.rotation,
        scale: container.scale,
        floorHeight
      });

      if (onLoad) {
        onLoad({ gltf, model: modelInstance, container, mixer });
      }
    },
    undefined,
    (error) => {
      console.error(`[MagicMirror] Failed to load magic mirror from ${resolvedPath}:`, error);
      if (onError) onError(error);
    }
  );

  let isHovered = false;
  let clickFlashTimer = 0;
  let glowLightRef = null;

  const setHover = (hover) => {
    isHovered = hover;
  };

  const triggerClick = () => {
    clickFlashTimer = 0.35; // 350ms flash
  };

  const update = (delta = 0.016) => {
    if (mixer) {
      mixer.update(delta);
    }

    if (glowLightRef) {
      if (clickFlashTimer > 0) {
        clickFlashTimer = Math.max(0, clickFlashTimer - delta);
        const flashProgress = clickFlashTimer / 0.35;
        glowLightRef.intensity = 2.4 + flashProgress * 2.8;
      } else {
        const targetIntensity = isHovered ? 2.4 : 1.2;
        glowLightRef.intensity = THREE.MathUtils.lerp(glowLightRef.intensity, targetIntensity, 0.12);
      }
    }
  };

  const dispose = () => {
    isDisposed = true;
    if (mixer) {
      mixer.stopAllAction();
    }
    if (modelInstance) {
      container.remove(modelInstance);
    }
    scene.remove(container);
  };

  return {
    container,
    getModel: () => modelInstance,
    getInteractiveObjects: () => (modelInstance ? [container] : []),
    setHover,
    triggerClick,
    update,
    dispose
  };
};

/**
 * React Component wrapper for MagicMirror in Three.js scenes
 */
export const MagicMirror = ({
  scene,
  position = MAGIC_MIRROR_CONFIG.position,
  rotation = MAGIC_MIRROR_CONFIG.rotation,
  scale = MAGIC_MIRROR_CONFIG.scale,
  floorHeight = MAGIC_MIRROR_CONFIG.floorHeight,
  onLoad,
  onError
}) => {
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!scene) return;

    instanceRef.current = loadMagicMirror({
      scene,
      position,
      rotation,
      scale,
      floorHeight,
      onLoad,
      onError
    });

    return () => {
      if (instanceRef.current) {
        instanceRef.current.dispose();
      }
    };
  }, [scene, position, rotation, scale, floorHeight, onLoad, onError]);

  return null;
};

export default MagicMirror;
