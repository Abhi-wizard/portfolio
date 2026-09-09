import { useState, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// In-memory model cache to avoid re-fetching heavy GLBs
const modelCache = new Map();

export const useModelLoader = (url) => {
  const [gltf, setGltf] = useState(() => modelCache.get(url) || null);
  const [loading, setLoading] = useState(!modelCache.has(url));
  const [progress, setProgress] = useState(modelCache.has(url) ? 100 : 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    if (modelCache.has(url)) {
      setGltf(modelCache.get(url));
      setLoading(false);
      setProgress(100);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setProgress(0);

    const loader = new GLTFLoader();

    loader.load(
      url,
      (loadedGltf) => {
        if (!isMounted) return;
        modelCache.set(url, loadedGltf);
        setGltf(loadedGltf);
        setLoading(false);
        setProgress(100);
      },
      (xhr) => {
        if (!isMounted) return;
        if (xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          setProgress(percent);
        }
      },
      (err) => {
        if (!isMounted) return;
        console.warn(`Failed to load 3D model from ${url}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { gltf, loading, progress, error };
};
