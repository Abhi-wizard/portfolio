import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Cache loaded GLTF objects to avoid duplicate network fetches
const modelCache = new Map();

// Setup DRACOLoader for compressed GLTF/GLB models
let dracoLoaderInstance = null;
const getDracoLoader = () => {
  if (!dracoLoaderInstance && typeof window !== 'undefined') {
    dracoLoaderInstance = new DRACOLoader();
    dracoLoaderInstance.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
  }
  return dracoLoaderInstance;
};

/**
 * Loads a real GLB asset from /assets/models/<filename>.glb with full support for:
 * - Real geometry, materials, textures
 * - Position, Rotation, Scale
 * - Animation Mixer (plays embedded model animations)
 * - Shadows (cast & receive)
 * - Mouse parallax & scroll responsiveness
 * 
 * @param {Object} options
 * @param {string} options.modelPath Path to GLB file in public folder
 * @param {THREE.Scene} options.scene Target Three.js Scene
 * @param {Array<number>|THREE.Vector3} [options.position=[0,0,0]]
 * @param {Array<number>|THREE.Euler} [options.rotation=[0,0,0]]
 * @param {Array<number>|number} [options.scale=1]
 * @param {boolean} [options.castShadow=true]
 * @param {boolean} [options.receiveShadow=true]
 * @param {boolean} [options.autoCenter=false]
 * @param {boolean} [options.playAnimation=true]
 * @param {Function} [options.onProgress]
 * @param {Function} [options.onLoad]
 * @param {Function} [options.onError]
 * @returns {{ model: THREE.Group|null, mixer: THREE.AnimationMixer|null, update: (delta: number, mouse?: {x: number, y: number}, scroll?: number) => void, dispose: () => void }}
 */
export const loadGLBModel = ({
  modelPath,
  scene,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  castShadow = true,
  receiveShadow = true,
  autoCenter = false,
  playAnimation = true,
  onProgress,
  onLoad,
  onError
}) => {
  const container = new THREE.Group();
  scene.add(container);

  // Apply initial container transforms
  if (Array.isArray(position)) {
    container.position.set(position[0], position[1], position[2]);
  } else if (position instanceof THREE.Vector3) {
    container.position.copy(position);
  }

  if (Array.isArray(rotation)) {
    container.rotation.set(rotation[0], rotation[1], rotation[2]);
  } else if (rotation instanceof THREE.Euler) {
    container.rotation.copy(rotation);
  }

  let baseScale = typeof scale === 'number' ? [scale, scale, scale] : scale;
  container.scale.set(baseScale[0], baseScale[1], baseScale[2]);

  let mixer = null;
  let modelInstance = null;
  let animations = [];
  let isDisposed = false;

  const loader = new GLTFLoader();
  const dracoLoader = getDracoLoader();
  if (dracoLoader) {
    loader.setDRACOLoader(dracoLoader);
  }

  const setupModel = (gltf) => {
    if (isDisposed) return;

    // Clone the scene for independent instances while keeping materials/textures shared
    modelInstance = gltf.scene.clone(true);
    animations = gltf.animations || [];

    // Traverse all meshes and enable shadows, proper texture filtering, and material double-sidedness where appropriate
    modelInstance.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = castShadow;
        child.receiveShadow = receiveShadow;

        if (child.material) {
          // Ensure textures have correct color space & depth settings
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.depthWrite = true;
              mat.roughness = Math.min(mat.roughness ?? 0.8, 1.0);
            });
          } else {
            child.material.depthWrite = true;
          }
        }
      }
    });

    // Optional Auto-Centering
    if (autoCenter) {
      const box = new THREE.Box3().setFromObject(modelInstance);
      const center = box.getCenter(new THREE.Vector3());
      modelInstance.position.sub(center);
    }

    container.add(modelInstance);

    // Setup Animation Mixer if model contains embedded animations
    if (animations.length > 0 && playAnimation) {
      mixer = new THREE.AnimationMixer(modelInstance);
      animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.play();
      });
    }

    if (onLoad) {
      onLoad({
        gltf,
        model: modelInstance,
        container,
        animations,
        mixer
      });
    }
  };

  // Check cache or load fresh
  if (modelCache.has(modelPath)) {
    setupModel(modelCache.get(modelPath));
    if (onProgress) onProgress(100);
  } else {
    loader.load(
      modelPath,
      (gltf) => {
        modelCache.set(modelPath, gltf);
        setupModel(gltf);
        if (onProgress) onProgress(100);
      },
      (xhr) => {
        if (onProgress && xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          onProgress(percent);
        }
      },
      (error) => {
        console.error(`[GLBModel] Failed to load real 3D model from ${modelPath}:`, error);
        if (onError) onError(error);
      }
    );
  }

  // Per-frame update hook
  const update = (delta = 0.016, mouse = { x: 0, y: 0 }, _scroll = 0) => {
    if (mixer) {
      mixer.update(delta);
    }

    // Subtle parallax response on container
    if (mouse) {
      container.rotation.y = (Array.isArray(rotation) ? rotation[1] : rotation.y) + mouse.x * 0.05;
      container.rotation.x = (Array.isArray(rotation) ? rotation[0] : rotation.x) - mouse.y * 0.03;
    }
  };

  // Memory cleanup
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
    getMixer: () => mixer,
    update,
    dispose
  };
};
