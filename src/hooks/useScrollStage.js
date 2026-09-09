import { useState, useEffect } from 'react';

export const useScrollStage = (sectionIds = ['hero', 'experience', 'skills', 'projects', 'achievements']) => {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);
  const [stageProgress, setStageProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      setTotalProgress(progress);

      // Determine active section based on midpoint of viewport
      const viewportMid = scrollY + window.innerHeight / 2;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (viewportMid >= top) {
            setActiveSection(sectionIds[i]);
            const sectionHeight = el.offsetHeight || window.innerHeight;
            const sectionProgress = Math.min(1, Math.max(0, (scrollY - top + window.innerHeight / 2) / sectionHeight));
            setStageProgress(sectionProgress);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  return { activeSection, stageProgress, totalProgress };
};
