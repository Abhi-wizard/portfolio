import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

let dracoLoaderInstance = null;
const getDracoLoader = () => {
  if (!dracoLoaderInstance && typeof window !== 'undefined') {
    dracoLoaderInstance = new DRACOLoader();
    dracoLoaderInstance.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
  }
  return dracoLoaderInstance;
};

/**
 * Creates the periodically flying Golden Snitch 3D object inside Three.js
 * Loads REAL GLB: /assets/models/harry_potter_-golden_snitch.glb
 * 
 * @param {THREE.Scene} scene
 * @returns {{ update: (delta: number) => void, isFlying: () => boolean, isLoaded: () => boolean, dispose: () => void }}
 */
export const createGoldenSnitchFlyer = (scene) => {
  const snitchRoot = new THREE.Group();
  snitchRoot.position.set(0, -100, 0); // Off-screen initially
  snitchRoot.renderOrder = 9999;
  scene.add(snitchRoot);

  const modelContainer = new THREE.Group();
  modelContainer.renderOrder = 9999;
  snitchRoot.add(modelContainer);

  // 1. Brilliant Golden Aura Light
  const snitchLight = new THREE.PointLight(0xffe066, 1.6, 6);
  snitchRoot.add(snitchLight);

  // 2. Trailing Golden Glitter Particle Sparks
  const sparkCount = 40;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPositions = new Float32Array(sparkCount * 3);
  const sparkVelocities = new Float32Array(sparkCount * 3);
  const sparkAges = new Float32Array(sparkCount);

  for (let i = 0; i < sparkCount; i++) {
    sparkAges[i] = 1.0; // expired
  }

  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));

  const sparkMat = new THREE.PointsMaterial({
    color: 0xfff080,
    size: 0.055,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false
  });

  const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
  sparkPoints.renderOrder = 9999;
  scene.add(sparkPoints);

  // 3. Load Real GLB Model: harry_potter_-golden_snitch.glb
  let rawModel = null;
  let isModelLoaded = false;
  let mixer = null;

  const loader = new GLTFLoader();
  const draco = getDracoLoader();
  if (draco) loader.setDRACOLoader(draco);

  loader.load(
    '/assets/models/harry_potter_-golden_snitch.glb',
    (gltf) => {
      rawModel = gltf.scene;
      rawModel.renderOrder = 9999;

      // Auto-center and normalize bounding box
      const box = new THREE.Box3().setFromObject(rawModel);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;

      // Scale to realistic snitch size
      const snitchScale = 0.55 / maxDim;
      rawModel.scale.set(snitchScale, snitchScale, snitchScale);
      rawModel.position.sub(center.multiplyScalar(snitchScale));

      rawModel.traverse((child) => {
        if (child.isMesh) {
          child.renderOrder = 9999;
          if (child.material) {
            child.material.depthTest = false;
            child.material.depthWrite = false;
            child.material.metalness = 0.95;
            child.material.roughness = 0.15;
          }
        }
      });

      // Play embedded wing animations if any
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(rawModel);
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });
      }

      modelContainer.add(rawModel);
      isModelLoaded = true;
    },
    undefined,
    (err) => {
      console.error('[GoldenSnitchFlyer] Error loading harry_potter_-golden_snitch.glb:', err);
    }
  );

  // 4. Snitch Flight Trajectory & Darting Physics
  let isFlying = false;
  let flightProgress = 0;
  let flightDuration = 3.8;
  let cooldownTimer = 2.5; // Starts soon after entering

  let p0 = new THREE.Vector3();
  let p1 = new THREE.Vector3();
  let p2 = new THREE.Vector3();
  let trailTimer = 0;
  let flutterTime = 0;

  const startNewFlight = () => {
    isFlying = true;
    flightProgress = 0;
    flightDuration = 3.2 + Math.random() * 1.8;

    // Fast darting diagonal trajectory across screen
    const fromTop = Math.random() > 0.5;
    const fromLeft = Math.random() > 0.5;

    const startX = fromLeft ? -6.5 - Math.random() * 2 : 6.5 + Math.random() * 2;
    const endX = fromLeft ? 6.5 + Math.random() * 2 : -6.5 - Math.random() * 2;

    const startY = fromTop ? 3.5 + Math.random() * 2 : -2.5 - Math.random() * 2;
    const midY = (Math.random() - 0.5) * 4;
    const endY = fromTop ? -3.0 - Math.random() * 2 : 3.5 + Math.random() * 2;

    const startZ = -1.5 - Math.random() * 2.0;
    const midZ = -0.5 + Math.random() * 1.5;
    const endZ = -2.0 - Math.random() * 2.0;

    p0.set(startX, startY, startZ);
    p1.set((startX + endX) / 2 + (Math.random() - 0.5) * 3, midY, midZ);
    p2.set(endX, endY, endZ);

    snitchLight.intensity = 1.8;
  };

  const getBezierPoint = (t, outVec) => {
    const invT = 1 - t;
    outVec.x = invT * invT * p0.x + 2 * invT * t * p1.x + t * t * p2.x;
    outVec.y = invT * invT * p0.y + 2 * invT * t * p1.y + t * t * p2.y;
    outVec.z = invT * invT * p0.z + 2 * invT * t * p1.z + t * t * p2.z;
    return outVec;
  };

  const currentPos = new THREE.Vector3();
  const nextPos = new THREE.Vector3();
  const tangent = new THREE.Vector3();

  const update = (delta = 0.016) => {
    flutterTime += delta * 18.0;

    if (mixer) {
      mixer.update(delta * 2.5); // rapid wing flutter
    }

    // Cooldown
    if (!isFlying) {
      cooldownTimer -= delta;
      if (cooldownTimer <= 0) {
        startNewFlight();
      }
      return;
    }

    // Active flight
    flightProgress += delta / flightDuration;

    if (flightProgress >= 1.0) {
      isFlying = false;
      snitchRoot.position.set(0, -100, 0);
      snitchLight.intensity = 0;
      cooldownTimer = 7.0 + Math.random() * 9.0; // Independent unpredictable cooldown
      return;
    }

    // Trajectory with rapid micro-flutter jitter (the Snitch's signature erratic movement)
    getBezierPoint(flightProgress, currentPos);
    getBezierPoint(Math.min(flightProgress + 0.02, 1.0), nextPos);
    tangent.subVectors(nextPos, currentPos).normalize();

    const flutterJitterY = Math.sin(flutterTime) * 0.12;
    const flutterJitterX = Math.cos(flutterTime * 1.3) * 0.08;

    snitchRoot.position.set(
      currentPos.x + flutterJitterX,
      currentPos.y + flutterJitterY,
      currentPos.z
    );

    // Dynamic bank & roll
    if (tangent.lengthSq() > 0.0001) {
      snitchRoot.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
    }
    modelContainer.rotation.z = Math.sin(flutterTime * 0.8) * 0.4;
    modelContainer.rotation.y += delta * 12.0;

    // Emit golden glitter sparks
    trailTimer += delta;
    if (trailTimer > 0.03) {
      trailTimer = 0;
      for (let i = 0; i < sparkCount; i++) {
        if (sparkAges[i] >= 1.0) {
          sparkAges[i] = 0;
          const i3 = i * 3;
          sparkPositions[i3] = snitchRoot.position.x + (Math.random() - 0.5) * 0.1;
          sparkPositions[i3 + 1] = snitchRoot.position.y + (Math.random() - 0.5) * 0.1;
          sparkPositions[i3 + 2] = snitchRoot.position.z + (Math.random() - 0.5) * 0.1;

          sparkVelocities[i3] = -tangent.x * 0.6 + (Math.random() - 0.5) * 0.3;
          sparkVelocities[i3 + 1] = -tangent.y * 0.6 + (Math.random() - 0.5) * 0.3;
          sparkVelocities[i3 + 2] = -tangent.z * 0.6 + (Math.random() - 0.5) * 0.3;
          break;
        }
      }
    }

    // Update particles
    const posArr = sparkGeo.attributes.position.array;
    for (let i = 0; i < sparkCount; i++) {
      if (sparkAges[i] < 1.0) {
        sparkAges[i] += delta * 2.2;
        const i3 = i * 3;
        posArr[i3] += sparkVelocities[i3] * delta;
        posArr[i3 + 1] += sparkVelocities[i3 + 1] * delta;
        posArr[i3 + 2] += sparkVelocities[i3 + 2] * delta;
      }
    }
    sparkGeo.attributes.position.needsUpdate = true;
  };

  const dispose = () => {
    scene.remove(snitchRoot);
    scene.remove(sparkPoints);
    sparkGeo.dispose();
    sparkMat.dispose();
    if (rawModel) {
      modelContainer.remove(rawModel);
    }
  };

  return {
    group: snitchRoot,
    update,
    isFlying: () => isFlying,
    isLoaded: () => isModelLoaded,
    dispose
  };
};
