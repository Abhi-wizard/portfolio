import React, { useEffect, useRef } from 'react';
import { loadGLBModel } from './GLBModel';

/**
 * React wrapper for loadGLBModel inside any Three.js canvas or standalone viewer
 */
export const GLBModel = ({
  scene,
  modelPath,
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
  const modelRef = useRef(null);

  useEffect(() => {
    if (!scene || !modelPath) return;

    modelRef.current = loadGLBModel({
      modelPath,
      scene,
      position,
      rotation,
      scale,
      castShadow,
      receiveShadow,
      autoCenter,
      playAnimation,
      onProgress,
      onLoad,
      onError
    });

    return () => {
      if (modelRef.current) {
        modelRef.current.dispose();
      }
    };
  }, [
    scene,
    modelPath,
    position,
    rotation,
    scale,
    castShadow,
    receiveShadow,
    autoCenter,
    playAnimation,
    onProgress,
    onLoad,
    onError
  ]);

  return null;
};

export default GLBModel;
