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
 * Creates the periodically flying Quidditch World Cup 3D object inside Three.js
 * @param {THREE.Scene} scene
 * @param {Function} [onClickCallback]
 * @returns {{ update: (delta: number) => void, checkClick: (raycaster: THREE.Raycaster) => boolean, isFlying: () => boolean, isCaptured: () => boolean, dispose: () => void }}
 */
export const createQuidditchFlyer = (scene, onClickCallback) => {
  const flyerRoot = new THREE.Group();
  flyerRoot.position.set(0, -100, 0); // Off-screen initially
  scene.add(flyerRoot);

  const modelContainer = new THREE.Group();
  flyerRoot.add(modelContainer);

  // 1. Aura & Impact Point Light
  const auraLight = new THREE.PointLight(0xffd700, 0, 10);
  flyerRoot.add(auraLight);

  // 2. Invisible Click Hitbox (to make interactive clicking responsive and forgiving)
  const hitboxGeo = new THREE.SphereGeometry(0.65, 12, 12);
  const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitboxMesh = new THREE.Mesh(hitboxGeo, hitboxMat);
  flyerRoot.add(hitboxMesh);

  // 3. Trailing Particle Sparks (pre-allocated buffer)
  const sparkCount = 45;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPositions = new Float32Array(sparkCount * 3);
  const sparkVelocities = new Float32Array(sparkCount * 3);
  const sparkAges = new Float32Array(sparkCount);

  for (let i = 0; i < sparkCount; i++) {
    sparkAges[i] = 1.0; // expired
  }

  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));

  const sparkMat = new THREE.PointsMaterial({
    color: 0xffe066,
    size: 0.07,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
  scene.add(sparkPoints);

  // 4. Impact Shockwave Ring on Click
  const impactGeo = new THREE.RingGeometry(0.1, 0.35, 32);
  const impactMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide
  });
  const impactRing = new THREE.Mesh(impactGeo, impactMat);
  flyerRoot.add(impactRing);

  // 5. Load Real GLB Model: harry_potter_quidditch_world_cup.glb
  let rawModel = null;
  let isModelLoaded = false;

  const loader = new GLTFLoader();
  const draco = getDracoLoader();
  if (draco) loader.setDRACOLoader(draco);

  loader.load(
    assetUrl('/assets/models/harry_potter_quidditch_world_cup.glb'),
    (gltf) => {
      rawModel = gltf.scene;

      // Auto-center and normalize bounding box
      const box = new THREE.Box3().setFromObject(rawModel);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;

      // Scale to realistic trophy size
      const trophyScale = 0.85 / maxDim;
      rawModel.scale.set(trophyScale, trophyScale, trophyScale);
      rawModel.position.sub(center.multiplyScalar(trophyScale));

      rawModel.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.metalness = 0.85;
            child.material.roughness = 0.25;
          }
        }
      });

      modelContainer.add(rawModel);
      isModelLoaded = true;
    },
    undefined,
    (err) => {
      console.error('[QuidditchFlyer] Error loading harry_potter_quidditch_world_cup.glb:', err);
    }
  );

  // 6. Flight Physics & Trajectory Generation
  let isFlying = false;
  let isCaptured = false;
  let captureTimer = 0;
  let flightProgress = 0;
  let flightDuration = 5.0;
  let cooldownTimer = 4.0; // Initial delay before first flight

  let p0 = new THREE.Vector3();
  let p1 = new THREE.Vector3();
  let p2 = new THREE.Vector3();
  let trailTimer = 0;
  let impactScale = 0.1;
  let impactOpacity = 0;

  const startNewFlight = () => {
    isFlying = true;
    isCaptured = false;
    flightProgress = 0;
    flightDuration = 4.5 + Math.random() * 2.0;

    // Pick randomized entry and exit sides across the Grand Hall
    const startFromLeft = Math.random() > 0.5;
    const startX = startFromLeft ? -7 - Math.random() * 2 : 7 + Math.random() * 2;
    const endX = startFromLeft ? 7 + Math.random() * 2 : -7 - Math.random() * 2;

    const startY = 1.0 + Math.random() * 3.5;
    const midY = 0.5 + Math.random() * 2.5;
    const endY = 1.5 + Math.random() * 3.0;

    const startZ = -2.0 - Math.random() * 3.0;
    const midZ = 0.5 + Math.random() * 2.0;
    const endZ = -2.0 - Math.random() * 3.0;

    p0.set(startX, startY, startZ);
    p1.set((startX + endX) / 2 + (Math.random() - 0.5) * 2, midY, midZ);
    p2.set(endX, endY, endZ);

    auraLight.intensity = 1.8;
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
    // 1. Cooldown when not flying
    if (!isFlying && !isCaptured) {
      cooldownTimer -= delta;
      if (cooldownTimer <= 0) {
        startNewFlight();
      }
      return;
    }

    // 2. Captured State (Hovering with magical impact highlight)
    if (isCaptured) {
      captureTimer += delta;

      // Gentle levitation spin
      modelContainer.rotation.y += delta * 2.5;
      modelContainer.rotation.x = Math.sin(captureTimer * 3.0) * 0.15;
      auraLight.intensity = Math.max(0, 4.0 - captureTimer * 0.8);

      // Expand impact shockwave
      if (impactOpacity > 0) {
        impactScale += delta * 8.0;
        impactOpacity -= delta * 1.5;
        impactRing.scale.set(impactScale, impactScale, impactScale);
        impactMat.opacity = Math.max(0, impactOpacity);
      }

      // Resume flight cooldown after 4 seconds
      if (captureTimer > 4.0) {
        isCaptured = false;
        isFlying = false;
        flyerRoot.position.set(0, -100, 0);
        cooldownTimer = 9.0 + Math.random() * 8.0;
      }
      return;
    }

    // 3. Active Flight Along Curved Spline
    flightProgress += delta / flightDuration;

    if (flightProgress >= 1.0) {
      // Completed flight pass
      isFlying = false;
      flyerRoot.position.set(0, -100, 0);
      auraLight.intensity = 0;
      cooldownTimer = 8.0 + Math.random() * 8.0; // Random unpredictable interval (8-16s)
      return;
    }

    // Compute trajectory position and look-ahead tangent
    getBezierPoint(flightProgress, currentPos);
    getBezierPoint(Math.min(flightProgress + 0.02, 1.0), nextPos);
    tangent.subVectors(nextPos, currentPos).normalize();

    flyerRoot.position.copy(currentPos);

    // Orient along flight path with tumbling roll
    if (tangent.lengthSq() > 0.0001) {
      flyerRoot.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
    }
    modelContainer.rotation.y += delta * 4.0;
    modelContainer.rotation.z += delta * 2.5;

    // 4. Emit Trailing Spark Particles
    trailTimer += delta;
    if (trailTimer > 0.04) {
      trailTimer = 0;
      for (let i = 0; i < sparkCount; i++) {
        if (sparkAges[i] >= 1.0) {
          sparkAges[i] = 0;
          const i3 = i * 3;
          sparkPositions[i3] = currentPos.x + (Math.random() - 0.5) * 0.15;
          sparkPositions[i3 + 1] = currentPos.y + (Math.random() - 0.5) * 0.15;
          sparkPositions[i3 + 2] = currentPos.z + (Math.random() - 0.5) * 0.15;

          sparkVelocities[i3] = -tangent.x * 0.8 + (Math.random() - 0.5) * 0.3;
          sparkVelocities[i3 + 1] = -tangent.y * 0.8 + (Math.random() - 0.5) * 0.3;
          sparkVelocities[i3 + 2] = -tangent.z * 0.8 + (Math.random() - 0.5) * 0.3;
          break;
        }
      }
    }

    // Update trail particles
    const posArr = sparkGeo.attributes.position.array;
    for (let i = 0; i < sparkCount; i++) {
      if (sparkAges[i] < 1.0) {
        sparkAges[i] += delta * 1.5;
        const i3 = i * 3;
        posArr[i3] += sparkVelocities[i3] * delta;
        posArr[i3 + 1] += sparkVelocities[i3 + 1] * delta;
        posArr[i3 + 2] += sparkVelocities[i3 + 2] * delta;
      }
    }
    sparkGeo.attributes.position.needsUpdate = true;
  };

  const checkClick = (raycaster) => {
    if (!isFlying || isCaptured) return false;

    const intersects = raycaster.intersectObjects([hitboxMesh, modelContainer], true);
    if (intersects.length > 0) {
      // Impact Hit!
      isCaptured = true;
      isFlying = false;
      captureTimer = 0;
      impactScale = 0.2;
      impactOpacity = 1;
      impactRing.quaternion.copy(flyerRoot.quaternion);

      // Burst sparks in all directions
      for (let i = 0; i < sparkCount; i++) {
        const i3 = i * 3;
        sparkPositions[i3] = flyerRoot.position.x;
        sparkPositions[i3 + 1] = flyerRoot.position.y;
        sparkPositions[i3 + 2] = flyerRoot.position.z;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = Math.random() * 2.5 + 1.2;

        sparkVelocities[i3] = Math.sin(phi) * Math.cos(theta) * speed;
        sparkVelocities[i3 + 1] = Math.cos(phi) * speed;
        sparkVelocities[i3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
        sparkAges[i] = 0;
      }

      if (onClickCallback) {
        onClickCallback({
          position: flyerRoot.position.clone(),
          name: 'Quidditch World Cup Trophy'
        });
      }

      return true;
    }

    return false;
  };

  const dispose = () => {
    scene.remove(flyerRoot);
    scene.remove(sparkPoints);
    hitboxGeo.dispose();
    hitboxMat.dispose();
    sparkGeo.dispose();
    sparkMat.dispose();
    impactGeo.dispose();
    impactMat.dispose();
    if (rawModel) {
      modelContainer.remove(rawModel);
    }
  };

  return {
    group: flyerRoot,
    update,
    checkClick,
    isFlying: () => isFlying,
    isCaptured: () => isCaptured,
    isLoaded: () => isModelLoaded,
    dispose
  };
};
