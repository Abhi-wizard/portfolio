import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createCourtyardFountain } from './CourtyardWater';
import { assetUrl } from '../../utils/assetUrl';

/**
 * Creates the complete 3D Courtyard environment, central fountain, character avatar,
 * and the wand-raising Lumos interaction.
 */
export const createCourtyardEnvironment = (scene, onWandActivate) => {
  const courtyardGroup = new THREE.Group();

  // 1. Cobblestone Courtyard Ground
  const groundGeo = new THREE.PlaneGeometry(60, 60, 32, 32);
  groundGeo.rotateX(-Math.PI / 2);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x14100c,
    roughness: 0.8,
    metalness: 0.2
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -1.8;
  ground.receiveShadow = true;
  courtyardGroup.add(ground);

  // 2. Gothic Perimeter Pillars & Arches
  const pillarGeo = new THREE.CylinderGeometry(0.5, 0.6, 8, 12);
  const pillarMat = new THREE.MeshStandardMaterial({
    color: 0x1d1711,
    roughness: 0.9,
    metalness: 0.1
  });

  const pillarPositions = [
    [-8, 2.2, -6],
    [-8, 2.2, 0],
    [-8, 2.2, 6],
    [8, 2.2, -6],
    [8, 2.2, 0],
    [8, 2.2, 6]
  ];

  pillarPositions.forEach(([x, y, z]) => {
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.set(x, y, z);
    courtyardGroup.add(pillar);

    // Small gothic wall sconce / torch light
    const torchLight = new THREE.PointLight(0xffa500, 1.2, 10);
    torchLight.position.set(x > 0 ? x - 0.6 : x + 0.6, y + 1.5, z);
    courtyardGroup.add(torchLight);
  });

  // 3. Central Enchanted Fountain
  const fountain = createCourtyardFountain(courtyardGroup);

  // 4. Character / Avatar Group
  const characterGroup = new THREE.Group();
  characterGroup.position.set(2.2, -1.8, 1.2);
  characterGroup.rotation.y = -Math.PI / 6;

  // Character Robe / Cloak Body
  const robeGeo = new THREE.ConeGeometry(0.75, 2.2, 16);
  const robeMat = new THREE.MeshStandardMaterial({
    color: 0x1f162b, // Midnight wizard violet
    roughness: 0.7,
    metalness: 0.3
  });
  const robe = new THREE.Mesh(robeGeo, robeMat);
  robe.position.y = 1.1;
  characterGroup.add(robe);

  // Gold Trim Collar / Mantle
  const mantleGeo = new THREE.TorusGeometry(0.42, 0.12, 12, 24);
  mantleGeo.rotateX(Math.PI / 2);
  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.3,
    metalness: 0.8
  });
  const mantle = new THREE.Mesh(mantleGeo, goldTrimMat);
  mantle.position.y = 2.0;
  characterGroup.add(mantle);

  // Head / Hood
  const hoodGeo = new THREE.SphereGeometry(0.32, 16, 16);
  const hoodMat = new THREE.MeshStandardMaterial({
    color: 0x160f21,
    roughness: 0.8
  });
  const hood = new THREE.Mesh(hoodGeo, hoodMat);
  hood.position.y = 2.25;
  characterGroup.add(hood);

  // Floating Arcane Amulet / Profile Crest
  const amuletGeo = new THREE.CircleGeometry(0.18, 24);
  const amuletMat = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    side: THREE.DoubleSide
  });
  const amulet = new THREE.Mesh(amuletGeo, amuletMat);
  amulet.position.set(0, 1.7, 0.38);
  characterGroup.add(amulet);

  // 5. Wand Arm & Elder Wand Attachment
  const wandArmGroup = new THREE.Group();
  wandArmGroup.position.set(0.35, 1.7, 0.1);

  // Arm sleeve
  const armGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.6, 12);
  armGeo.rotateZ(Math.PI / 4);
  const arm = new THREE.Mesh(armGeo, robeMat);
  arm.position.set(0.2, -0.15, 0);
  wandArmGroup.add(arm);

  // Elder Wand container
  const wandContainer = new THREE.Group();
  wandContainer.position.set(0.4, -0.25, 0.15);
  wandContainer.rotation.set(-0.2, 0.4, -0.8);
  wandArmGroup.add(wandContainer);

  // Load Elder Wand GLB
  const loader = new GLTFLoader();
  loader.load(
    assetUrl('/assets/models/elder_wand.glb'),
    (gltf) => {
      const wand = gltf.scene;
      wand.scale.set(0.008, 0.008, 0.008);
      wand.rotation.x = Math.PI / 2;
      wandContainer.add(wand);
    },
    undefined,
    (err) => {
      console.warn('Procedural wand fallback:', err);
      // Fallback wand geometry
      const fallbackWandGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.8, 8);
      const fallbackWandMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18 });
      const fallbackWand = new THREE.Mesh(fallbackWandGeo, fallbackWandMat);
      fallbackWand.rotation.z = Math.PI / 3;
      wandContainer.add(fallbackWand);
    }
  );

  // Lumos Beacon Point Light at Wand Tip
  const wandTipLight = new THREE.PointLight(0xfff0b3, 0, 8);
  wandTipLight.position.set(0.8, 0.1, 0.4);
  wandArmGroup.add(wandTipLight);

  // Lumos Shockwave Expansion Ring
  const shockwaveGeo = new THREE.RingGeometry(0.1, 0.25, 32);
  shockwaveGeo.rotateX(-Math.PI / 2);
  const shockwaveMat = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide
  });
  const shockwaveRing = new THREE.Mesh(shockwaveGeo, shockwaveMat);
  shockwaveRing.position.set(0.8, 0.1, 0.4);
  wandArmGroup.add(shockwaveRing);

  characterGroup.add(wandArmGroup);
  courtyardGroup.add(characterGroup);
  scene.add(courtyardGroup);

  // 6. Interaction & Animation State
  let wandRaised = false;
  let wandProgress = 0; // 0 (idle) to 1 (fully raised)
  let shockwaveActive = false;
  let shockwaveScale = 0.1;
  let shockwaveOpacity = 0;
  let hasTriggeredNav = false;
  let idleTimer = 0;

  const update = (delta = 0.016, mouse = { x: 0, y: 0 }, isCourtyardActive = true) => {
    idleTimer += delta;

    // Update central fountain
    fountain.update(delta);

    if (!isCourtyardActive) {
      courtyardGroup.visible = false;
      return;
    }
    courtyardGroup.visible = true;

    // Subtle natural breathing cycle
    const breath = Math.sin(idleTimer * 2.0) * 0.02;
    robe.scale.set(1 + breath * 0.5, 1 + breath, 1 + breath * 0.5);
    hood.position.y = 2.25 + breath * 0.5;
    amulet.position.y = 1.7 + breath * 0.5;

    // Smooth head & body orientation subtly following cursor
    const targetRotY = -Math.PI / 6 + mouse.x * 0.35;
    characterGroup.rotation.y += (targetRotY - characterGroup.rotation.y) * 0.04;
    hood.rotation.x = -mouse.y * 0.2;
    hood.rotation.y = mouse.x * 0.25;

    // Cursor proximity check: when mouse nears center-right (near character)
    const distToCharacter = Math.hypot(mouse.x - 0.4, mouse.y - 0.1);
    const isCursorNear = distToCharacter < 0.65;

    if (isCursorNear && !wandRaised) {
      wandRaised = true;
    } else if (!isCursorNear && wandRaised && !shockwaveActive) {
      wandRaised = false;
    }

    // Smooth wand elevation transition
    const targetProgress = wandRaised ? 1 : 0;
    wandProgress += (targetProgress - wandProgress) * 0.08;

    // Interpolate wand arm angle into casting posture
    wandArmGroup.rotation.x = -wandProgress * 0.6;
    wandArmGroup.rotation.z = -wandProgress * 0.8;
    wandArmGroup.position.y = 1.7 + wandProgress * 0.3;

    // Lumos spell ignition
    if (wandProgress > 0.6) {
      const sparkGlow = (wandProgress - 0.6) * 2.5;
      wandTipLight.intensity = (2.5 + Math.sin(idleTimer * 12) * 0.5) * sparkGlow;

      // Trigger shockwave when reaching peak raise
      if (wandProgress > 0.95 && !hasTriggeredNav) {
        hasTriggeredNav = true;
        shockwaveActive = true;
        shockwaveScale = 0.2;
        shockwaveOpacity = 1;
        if (onWandActivate) onWandActivate();
      }
    } else {
      wandTipLight.intensity = 0;
    }

    // Shockwave expansion animation
    if (shockwaveActive) {
      shockwaveScale += delta * 18;
      shockwaveOpacity -= delta * 1.2;
      shockwaveRing.scale.set(shockwaveScale, shockwaveScale, shockwaveScale);
      shockwaveMat.opacity = Math.max(0, shockwaveOpacity);

      if (shockwaveOpacity <= 0) {
        shockwaveActive = false;
      }
    }
  };

  const castManualSpell = () => {
    wandRaised = true;
    hasTriggeredNav = false;
  };

  const dispose = () => {
    scene.remove(courtyardGroup);
    fountain.dispose();
    groundGeo.dispose();
    groundMat.dispose();
    pillarGeo.dispose();
    pillarMat.dispose();
    robeGeo.dispose();
    robeMat.dispose();
    mantleGeo.dispose();
    goldTrimMat.dispose();
    hoodGeo.dispose();
    hoodMat.dispose();
    amuletGeo.dispose();
    amuletMat.dispose();
    armGeo.dispose();
    shockwaveGeo.dispose();
    shockwaveMat.dispose();
  };

  return { group: courtyardGroup, update, castManualSpell, dispose };
};
