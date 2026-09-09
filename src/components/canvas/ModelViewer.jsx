import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { assetUrl } from '../../utils/assetUrl';

const ModelViewer = ({
  modelPath,
  scale = 1,
  autoRotate = true,
  rotationSpeed = 0.01,
  className = '',
  height = '300px',
  fallbackText = 'Loading Magical Artifact...'
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !modelPath) return;

    const resolvedPath = assetUrl(modelPath);
    const width = mount.clientWidth || 300;
    const heightPx = mount.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.2);
    scene.add(ambientLight);

    const goldLight = new THREE.DirectionalLight(0xffd700, 2);
    goldLight.position.set(5, 5, 5);
    scene.add(goldLight);

    const fillLight = new THREE.DirectionalLight(0x708090, 1);
    fillLight.position.set(-5, -5, -2);
    scene.add(fillLight);

    let model = null;
    let animId;
    const loader = new GLTFLoader();

    loader.load(
      resolvedPath,
      (gltf) => {

        model = gltf.scene;

        // Auto center bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const autoScale = (2.5 / (maxDim || 1)) * scale;

        model.scale.set(autoScale, autoScale, autoScale);
        model.position.sub(center.multiplyScalar(autoScale));
        scene.add(model);
      },
      undefined,
      (err) => {
        console.warn(`Failed to preview model ${modelPath}:`, err);
      }
    );

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (model && autoRotate) {
        model.rotation.y += rotationSpeed;
      }
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelPath, scale, autoRotate, rotationSpeed]);

  return (
    <div
      ref={mountRef}
      className={`model-viewer-container ${className}`}
      style={{ width: '100%', height, position: 'relative' }}
      aria-label={fallbackText}
    />
  );
};

export default ModelViewer;
