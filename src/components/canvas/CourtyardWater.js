import * as THREE from 'three';

/**
 * Creates the enchanted courtyard fountain with tiered stone basins and animated water particles
 * @param {THREE.Scene} scene 
 * @returns {{ group: THREE.Group, update: (delta: number) => void, dispose: () => void }}
 */
export const createCourtyardFountain = (scene) => {
  const fountainGroup = new THREE.Group();
  fountainGroup.position.set(0, -1.8, 0);

  // 1. Stone Materials
  const darkGothicStone = new THREE.MeshStandardMaterial({
    color: 0x221b14,
    roughness: 0.85,
    metalness: 0.15,
    bumpScale: 0.05
  });

  const carvedGoldRim = new THREE.MeshStandardMaterial({
    color: 0x8a6d3b,
    roughness: 0.4,
    metalness: 0.8,
    emissive: 0x3d2806,
    emissiveIntensity: 0.2
  });

  // 2. Multi-tier Basin Geometry
  // Lower Basin
  const lowerBasinGeo = new THREE.CylinderGeometry(3.6, 4.0, 0.6, 32);
  const lowerBasin = new THREE.Mesh(lowerBasinGeo, darkGothicStone);
  lowerBasin.position.y = 0.3;
  lowerBasin.receiveShadow = true;
  fountainGroup.add(lowerBasin);

  const lowerRimGeo = new THREE.TorusGeometry(3.7, 0.15, 16, 48);
  lowerRimGeo.rotateX(Math.PI / 2);
  const lowerRim = new THREE.Mesh(lowerRimGeo, carvedGoldRim);
  lowerRim.position.y = 0.6;
  fountainGroup.add(lowerRim);

  // Middle Pedestal & Basin
  const midPedestalGeo = new THREE.CylinderGeometry(0.8, 1.2, 1.2, 16);
  const midPedestal = new THREE.Mesh(midPedestalGeo, darkGothicStone);
  midPedestal.position.y = 1.2;
  fountainGroup.add(midPedestal);

  const midBasinGeo = new THREE.CylinderGeometry(2.0, 2.3, 0.4, 24);
  const midBasin = new THREE.Mesh(midBasinGeo, darkGothicStone);
  midBasin.position.y = 1.9;
  fountainGroup.add(midBasin);

  const midRimGeo = new THREE.TorusGeometry(2.1, 0.1, 16, 36);
  midRimGeo.rotateX(Math.PI / 2);
  const midRim = new THREE.Mesh(midRimGeo, carvedGoldRim);
  midRim.position.y = 2.1;
  fountainGroup.add(midRim);

  // Upper Obelisk / Spire
  const upperSpireGeo = new THREE.ConeGeometry(0.5, 1.6, 8);
  const upperSpire = new THREE.Mesh(upperSpireGeo, carvedGoldRim);
  upperSpire.position.y = 3.0;
  fountainGroup.add(upperSpire);

  // 3. Glowing Pool Water Surfaces
  const waterMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1a759f,
    emissive: 0x0f4c5c,
    emissiveIntensity: 0.6,
    roughness: 0.1,
    transmission: 0.7,
    thickness: 0.8,
    transparent: true,
    opacity: 0.85
  });

  const lowerWaterGeo = new THREE.CircleGeometry(3.5, 32);
  lowerWaterGeo.rotateX(-Math.PI / 2);
  const lowerWater = new THREE.Mesh(lowerWaterGeo, waterMaterial);
  lowerWater.position.y = 0.55;
  fountainGroup.add(lowerWater);

  const midWaterGeo = new THREE.CircleGeometry(1.95, 24);
  midWaterGeo.rotateX(-Math.PI / 2);
  const midWater = new THREE.Mesh(midWaterGeo, waterMaterial);
  midWater.position.y = 2.05;
  fountainGroup.add(midWater);

  // 4. Cascading Water Droplets & Floating Arcane Motes
  const dropCount = 450;
  const dropGeo = new THREE.BufferGeometry();
  const dropPositions = new Float32Array(dropCount * 3);
  const dropVelocities = new Float32Array(dropCount * 3);

  for (let i = 0; i < dropCount; i++) {
    const i3 = i * 3;
    // Spawn near top of spire
    dropPositions[i3] = (Math.random() - 0.5) * 0.4;
    dropPositions[i3 + 1] = 3.6 + Math.random() * 0.4;
    dropPositions[i3 + 2] = (Math.random() - 0.5) * 0.4;

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.8 + 0.3;
    dropVelocities[i3] = Math.cos(angle) * speed;
    dropVelocities[i3 + 1] = Math.random() * 1.5 + 1.0;
    dropVelocities[i3 + 2] = Math.sin(angle) * speed;
  }

  dropGeo.setAttribute('position', new THREE.BufferAttribute(dropPositions, 3));

  const dropMat = new THREE.PointsMaterial({
    color: 0x90e0ef,
    size: 0.08,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  const waterParticles = new THREE.Points(dropGeo, dropMat);
  fountainGroup.add(waterParticles);

  // 5. Internal Pool Bioluminescent Glow Light
  const poolLight = new THREE.PointLight(0x00b4d8, 2.0, 6);
  poolLight.position.set(0, 1.2, 0);
  fountainGroup.add(poolLight);

  scene.add(fountainGroup);

  // Animation updates
  let time = 0;
  const update = (delta = 0.016) => {
    time += delta;

    // Pulsing water surface and light shimmer
    poolLight.intensity = 1.8 + Math.sin(time * 3) * 0.4;
    waterMaterial.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.2;

    for (let i = 0; i < dropCount; i++) {
      const i3 = i * 3;
      // Gravity acceleration
      dropPositions[i3 + 1] -= (9.8 * 0.3) * delta;
      dropPositions[i3] += dropVelocities[i3] * delta * 0.4;
      dropPositions[i3 + 2] += dropVelocities[i3 + 2] * delta * 0.4;

      // Reset when falling below lower basin
      if (dropPositions[i3 + 1] < 0.6) {
        dropPositions[i3] = (Math.random() - 0.5) * 0.3;
        dropPositions[i3 + 1] = 3.6 + Math.random() * 0.3;
        dropPositions[i3 + 2] = (Math.random() - 0.5) * 0.3;
      }
    }
    dropGeo.attributes.position.needsUpdate = true;
  };

  const dispose = () => {
    scene.remove(fountainGroup);
    lowerBasinGeo.dispose();
    midPedestalGeo.dispose();
    midBasinGeo.dispose();
    upperSpireGeo.dispose();
    dropGeo.dispose();
    darkGothicStone.dispose();
    carvedGoldRim.dispose();
    waterMaterial.dispose();
    dropMat.dispose();
  };

  return { group: fountainGroup, update, dispose };
};
