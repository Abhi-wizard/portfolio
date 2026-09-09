import { useState, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { assetUrl } from '../utils/assetUrl';

// In-memory model cache to avoid re-fetching heavy GLBs
const modelCache = new Map();

export const useModelLoader = (url) => {
  const resolvedUrl = url ? assetUrl(url) : null;
  const [gltf, setGltf] = useState(() => (resolvedUrl ? modelCache.get(resolvedUrl) || null : null));
  const [loading, setLoading] = useState(resolvedUrl ? !modelCache.has(resolvedUrl) : false);
  const [progress, setProgress] = useState(resolvedUrl && modelCache.has(resolvedUrl) ? 100 : 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resolvedUrl) return;

    if (modelCache.has(resolvedUrl)) {
      setGltf(modelCache.get(resolvedUrl));
      setLoading(false);
      setProgress(100);
      return;
    }


    let isMounted = true;
    setLoading(true);
    setProgress(0);

    const loader = new GLTFLoader();

    loader.load(
      resolvedUrl,
      (loadedGltf) => {
        if (!isMounted) return;
        modelCache.set(resolvedUrl, loadedGltf);
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
        console.warn(`Failed to load 3D model from ${resolvedUrl}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
    };
  }, [resolvedUrl]);

  return { gltf, loading, progress, error };
};
