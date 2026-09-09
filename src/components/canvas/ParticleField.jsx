import * as THREE from 'three';

/**
 * Creates a magical particle field with lumos golden embers and arcane dust
 * @param {THREE.Scene} scene 
 * @param {number} count 
 * @returns {{ particles: THREE.Points, update: (delta: number, mouse: {x: number, y: number}) => void, dispose: () => void }}
 */
export const createParticleField = (scene, count = 1200) => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const speeds = new Float32Array(count * 3);

  const baseGold = new THREE.Color('#ffd700');
  const brightGold = new THREE.Color('#fff4cc');
  const arcaneCyan = new THREE.Color('#d4af37');

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // Spatial distribution
    positions[i3] = (Math.random() - 0.5) * 50;
    positions[i3 + 1] = (Math.random() - 0.5) * 50;
    positions[i3 + 2] = (Math.random() - 0.5) * 50;

    // Speeds for buoyant floating
    speeds[i3] = (Math.random() - 0.5) * 0.2;
    speeds[i3 + 1] = Math.random() * 0.4 + 0.1;
    speeds[i3 + 2] = (Math.random() - 0.5) * 0.2;

    // Varied particle size
    scales[i] = Math.random() * 3.5 + 1.0;

    // Color gradient
    const mixFactor = Math.random();
    const col = mixFactor > 0.7 ? brightGold : mixFactor > 0.3 ? baseGold : arcaneCyan;
    colors[i3] = col.r;
    colors[i3 + 1] = col.g;
    colors[i3 + 2] = col.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

  // Circular spark texture
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 215, 0, 0.8)');
  gradient.addColorStop(0.7, 'rgba(180, 130, 40, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);

  const material = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    map: texture,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const update = (delta = 0.016, mouse = { x: 0, y: 0 }) => {
    const posAttr = geometry.attributes.position;
    const pos = posAttr.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Gentle rising and swaying motion
      pos[i3] += speeds[i3] * delta + mouse.x * 0.02;
      pos[i3 + 1] += speeds[i3 + 1] * delta;
      pos[i3 + 2] += speeds[i3 + 2] * delta + mouse.y * 0.02;

      // Wrap around bounds
      if (pos[i3 + 1] > 25) pos[i3 + 1] = -25;
      if (pos[i3] > 25) pos[i3] = -25;
      if (pos[i3] < -25) pos[i3] = 25;
      if (pos[i3 + 2] > 25) pos[i3 + 2] = -25;
      if (pos[i3 + 2] < -25) pos[i3 + 2] = 25;
    }

    posAttr.needsUpdate = true;
    particles.rotation.y += 0.0005;
  };

  const dispose = () => {
    scene.remove(particles);
    geometry.dispose();
    material.dispose();
    texture.dispose();
  };

  return { particles, update, dispose };
};
