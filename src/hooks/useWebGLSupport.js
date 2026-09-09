import { useState, useEffect } from 'react';

export const useWebGLSupport = () => {
  const [supportState, setSupportState] = useState({
    supported: true,
    tier: 'high', // 'high' | 'medium' | 'low' | 'unsupported'
    isChecking: true
  });

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        setSupportState({
          supported: false,
          tier: 'unsupported',
          isChecking: false
        });
        return;
      }

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;
      const isLowGpu = /Intel HD Graphics|Mali|Adreno/i.test(renderer);

      let tier = 'high';
      if (isMobile && isLowGpu) {
        tier = 'low';
      } else if (isMobile || isLowGpu) {
        tier = 'medium';
      }

      setSupportState({
        supported: true,
        tier,
        isChecking: false
      });
    } catch {
      setSupportState({
        supported: false,
        tier: 'unsupported',
        isChecking: false
      });
    }
  }, []);

  return supportState;
};
