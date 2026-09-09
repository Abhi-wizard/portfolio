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
 * Creates the 3D Elder Wand Cursor that follows the visitor's pointer,
 * rotates naturally, casts dynamic lighting onto the Grand Hall, leaves a spark trail,
 * and triggers a Lumos shockwave blast on click.
 * 
 * Configured with renderOrder = 99999 and depthTest = false to ALWAYS remain on top.
 */
export const createWandCursor3D = (scene, camera, onActivate) => {
  const wandCursorGroup = new THREE.Group();
  wandCursorGroup.renderOrder = 99999;
  scene.add(wandCursorGroup);

  const modelPivot = new THREE.Group();
  modelPivot.renderOrder = 99999;
  wandCursorGroup.add(modelPivot);

  // 1. Dynamic Wand Tip Beacon Light
  const tipLight = new THREE.PointLight(0xffdf80, 2.2, 10);
  tipLight.position.set(0.65, 0.45, 0);
  wandCursorGroup.add(tipLight);

  // 2. Shockwave Light Ring on Spell Cast
  const shockwaveGeo = new THREE.RingGeometry(0.05, 0.15, 32);
  const shockwaveMat = new THREE.MeshBasicMaterial({
    color: 0xfff4c2,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthTest: false,
    depthWrite: false
  });
  const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
  shockwaveMesh.renderOrder = 99999;
  shockwaveMesh.position.copy(tipLight.position);
  wandCursorGroup.add(shockwaveMesh);

  // 3. Wand Tip Particle Spark Trail (pre-allocated buffer)
  const trailCount = 35;
  const trailGeo = new THREE.BufferGeometry();
  const trailPositions = new Float32Array(trailCount * 3);
  const trailOpacities = new Float32Array(trailCount);
  const trailVelocities = new Float32Array(trailCount * 3);
  const trailAges = new Float32Array(trailCount);

  for (let i = 0; i < trailCount; i++) {
    trailAges[i] = 1.0; // expired initially
    trailOpacities[i] = 0;
  }

  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
  trailGeo.setAttribute('opacity', new THREE.BufferAttribute(trailOpacities, 1));

  const trailMat = new THREE.PointsMaterial({
    color: 0xffd700,
    size: 0.06,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false
  });

  const trailPoints = new THREE.Points(trailGeo, trailMat);
  trailPoints.renderOrder = 99999;
  scene.add(trailPoints);

  // 4. Load the REAL GLB Model: elder_wand.glb
  let rawWandModel = null;
  let isModelReady = false;

  const loader = new GLTFLoader();
  const draco = getDracoLoader();
  if (draco) loader.setDRACOLoader(draco);

  loader.load(
    assetUrl('/assets/models/elder_wand.glb'),
    (gltf) => {
      rawWandModel = gltf.scene;
      rawWandModel.renderOrder = 99999;

      // Auto-center and align wand along handle-to-tip diagonal
      const box = new THREE.Box3().setFromObject(rawWandModel);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;

      // Scale to a natural wand size in cursor space
      const wandScale = 0.95 / maxDim;
      rawWandModel.scale.set(wandScale, wandScale, wandScale);
      rawWandModel.position.sub(center.multiplyScalar(wandScale));

      // Diagonal casting posture
      rawWandModel.rotation.set(0.1, Math.PI / 4, -0.65);

      rawWandModel.traverse((child) => {
        if (child.isMesh) {
          child.renderOrder = 99999;
          if (child.material) {
            child.material.depthTest = false;
            child.material.depthWrite = false;
            child.material.roughness = 0.55;
            child.material.metalness = 0.3;
          }
        }
      });

      modelPivot.add(rawWandModel);
      isModelReady = true;
    },
    undefined,
    (err) => {
      console.error('[WandCursor3D] Error loading elder_wand.glb:', err);
    }
  );

  // Cursor Tracking & Physics State
  const currentPos = new THREE.Vector3(0, 0, 0);
  const targetPos = new THREE.Vector3(0, 0, 0);
  let prevMouseX = 0;
  let prevMouseY = 0;
  let mouseVelX = 0;
  let mouseVelY = 0;
  let tiltX = 0;
  let tiltY = 0;
  let tiltZ = 0;

  let isCasting = false;
  let castTimer = 0;
  let shockwaveScale = 0.1;
  let shockwaveOpacity = 0;
  let trailSpawnTimer = 0;
  let isVisible = true;
  let time = 0;

  const castSpell = () => {
    isCasting = true;
    castTimer = 0;
    shockwaveScale = 0.15;
    shockwaveOpacity = 1;

    // Burst all trail particles
    for (let i = 0; i < trailCount; i++) {
      const i3 = i * 3;
      const worldTip = tipLight.getWorldPosition(new THREE.Vector3());
      trailPositions[i3] = worldTip.x;
      trailPositions[i3 + 1] = worldTip.y;
      trailPositions[i3 + 2] = worldTip.z;

      const angle = (i / trailCount) * Math.PI * 2;
      const speed = Math.random() * 2.5 + 1.0;
      trailVelocities[i3] = Math.cos(angle) * speed;
      trailVelocities[i3 + 1] = Math.sin(angle) * speed + (Math.random() - 0.5);
      trailVelocities[i3 + 2] = (Math.random() - 0.5) * speed;
      trailAges[i] = 0;
    }

    if (onActivate) {
      onActivate();
    }
  };

  const update = (delta = 0.016, mouse = { x: 0, y: 0 }) => {
    time += delta;

    if (!isVisible) {
      wandCursorGroup.visible = false;
      trailPoints.visible = false;
      return;
    }
    wandCursorGroup.visible = true;
    trailPoints.visible = true;

    // Compute pointer velocity for natural rotational lean
    mouseVelX = (mouse.x - prevMouseX) / Math.max(delta, 0.001);
    mouseVelY = (mouse.y - prevMouseY) / Math.max(delta, 0.001);
    prevMouseX = mouse.x;
    prevMouseY = mouse.y;

    // Unproject normalized mouse coordinates to 3D position in front of camera
    const planeDistance = 2.8; // depth in front of camera
    const fovRad = (camera.fov * Math.PI) / 180;
    const planeHeight = 2 * Math.tan(fovRad / 2) * planeDistance;
    const planeWidth = planeHeight * camera.aspect;

    // Relative to camera coordinate frame
    const localTarget = new THREE.Vector3(
      (mouse.x * planeWidth) / 2 + 0.15,
      (mouse.y * planeHeight) / 2 - 0.15,
      -planeDistance
    );

    targetPos.copy(localTarget).applyMatrix4(camera.matrixWorld);

    // Smooth lerp follow
    currentPos.lerp(targetPos, 0.25);
    wandCursorGroup.position.copy(currentPos);

    // Natural inertia tilts based on pointer velocity
    const targetTiltZ = -THREE.MathUtils.clamp(mouseVelX * 0.04, -0.6, 0.6);
    const targetTiltX = THREE.MathUtils.clamp(mouseVelY * 0.04, -0.4, 0.4);
    const targetTiltY = THREE.MathUtils.clamp(mouseVelX * 0.03, -0.3, 0.3);

    tiltZ = THREE.MathUtils.lerp(tiltZ, targetTiltZ, 0.12);
    tiltX = THREE.MathUtils.lerp(tiltX, targetTiltX, 0.12);
    tiltY = THREE.MathUtils.lerp(tiltY, targetTiltY, 0.12);

    // Wand orientation matches camera orientation + dynamic tilts
    wandCursorGroup.quaternion.copy(camera.quaternion);
    modelPivot.rotation.set(tiltX, tiltY, tiltZ);

    // Flick animation during cast
    if (isCasting) {
      castTimer += delta;

      // Wand flick motion
      const flickProgress = Math.sin(Math.min(castTimer * 8.0, Math.PI));
      modelPivot.rotation.x += flickProgress * 0.45;
      modelPivot.rotation.z -= flickProgress * 0.35;

      // Intense Lumos Flash
      tipLight.intensity = Math.max(0, 16.0 - castTimer * 8.0);
      tipLight.color.setHex(0xffffff);

      // Expand shockwave
      shockwaveScale += delta * 12.0;
      shockwaveOpacity -= delta * 1.5;
      shockwaveMesh.scale.set(shockwaveScale, shockwaveScale, shockwaveScale);
      shockwaveMat.opacity = Math.max(0, shockwaveOpacity);

      if (castTimer > 1.8) {
        isCasting = false;
      }
    } else {
      // Gentle ambient glow when idle
      const ambientGlow = 2.4 + Math.sin(time * 6.0) * 0.5;
      tipLight.intensity = THREE.MathUtils.lerp(tipLight.intensity, ambientGlow, 0.1);
      tipLight.color.setHex(0xffe28a);
    }

    // 5. Emit Spark Trail Particles from Tip
    trailSpawnTimer += delta;
    if (trailSpawnTimer > 0.035) {
      trailSpawnTimer = 0;

      for (let i = 0; i < trailCount; i++) {
        if (trailAges[i] >= 1.0) {
          trailAges[i] = 0;
          const worldTip = tipLight.getWorldPosition(new THREE.Vector3());
          trailPositions[i * 3] = worldTip.x + (Math.random() - 0.5) * 0.04;
          trailPositions[i * 3 + 1] = worldTip.y + (Math.random() - 0.5) * 0.04;
          trailPositions[i * 3 + 2] = worldTip.z + (Math.random() - 0.5) * 0.04;

          trailVelocities[i * 3] = (Math.random() - 0.5) * 0.15 - mouseVelX * 0.02;
          trailVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.15 - mouseVelY * 0.02;
          trailVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
          break;
        }
      }
    }

    // Update trail particle physics & fade
    const posArr = trailGeo.attributes.position.array;
    for (let i = 0; i < trailCount; i++) {
      if (trailAges[i] < 1.0) {
        trailAges[i] += delta * 1.8;
        const i3 = i * 3;
        posArr[i3] += trailVelocities[i3] * delta;
        posArr[i3 + 1] += trailVelocities[i3 + 1] * delta;
        posArr[i3 + 2] += trailVelocities[i3 + 2] * delta;
      }
    }
    trailGeo.attributes.position.needsUpdate = true;
  };

  const setVisible = (val) => {
    isVisible = val;
  };

  const dispose = () => {
    scene.remove(wandCursorGroup);
    scene.remove(trailPoints);
    shockwaveGeo.dispose();
    shockwaveMat.dispose();
    trailGeo.dispose();
    trailMat.dispose();
    if (rawWandModel) {
      modelPivot.remove(rawWandModel);
    }
  };

  return {
    group: wandCursorGroup,
    update,
    castSpell,
    isCasting: () => isCasting,
    setVisible,
    isLoaded: () => isModelReady,
    dispose
  };
};
