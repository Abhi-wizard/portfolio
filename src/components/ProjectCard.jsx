import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaTimes, FaExpand } from 'react-icons/fa';
import { assetUrl } from '../utils/assetUrl';

const ProjectCard = ({ project }) => {
  const [discoveredImages, setDiscoveredImages] = useState([]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    if (project.images && project.images.length > 0) {
      setDiscoveredImages(project.images.map((img) => assetUrl(img)));
      setIsLoading(false);
      return;
    }


    let active = true;
    const found = [];
    const extensions = ['.jpg', '.png', '.jpeg', '.svg'];

    const probeImage = async (index) => {
      if (!active) return;
      
      let resolvedUrl = null;
      
      for (const ext of extensions) {
        const url = `${project.imageFolder}/${index}${ext}`;
        const success = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        });

        if (success) {
          resolvedUrl = url;
          break;
        }
      }

      if (resolvedUrl) {
        found.push(resolvedUrl);
        if (active) {
          setDiscoveredImages([...found]);
          setIsLoading(false);
        }
        
        probeImage(index + 1);
      } else {
        
        if (active && found.length === 0) {
          setIsLoading(false);
        }
      }
    };

    if (project.imageFolder) {
      setIsLoading(true);
      probeImage(1);
    }

    return () => {
      active = false;
    };
  }, [project.imageFolder]);

  const hasImages = discoveredImages.length > 0;

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % discoveredImages.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + discoveredImages.length) % discoveredImages.length);
  };

  const openLightbox = (e) => {
    e.stopPropagation();
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  return (
    <>
      <div className="project-card">
        <div className="scroll-inner">
          <h3 className="project-title">{project.title}</h3>
          <p className="project-desc">{project.description}</p>
          <div className="project-tech-stack">
            <strong>Enchantments Used:</strong> {project.techStack}
          </div>

          <div className="project-placeholder-img">
            {isLoading ? (
              <span className="loading-images">Scanning archives...</span>
            ) : hasImages ? (
              <>
                <img 
                  src={discoveredImages[currentImgIndex]} 
                  alt={`${project.title} screenshot ${currentImgIndex + 1}`} 
                  className="project-img" 
                  onClick={openLightbox}
                />
                
                {discoveredImages.length > 1 && (
                  <>
                    <button className="slide-arrow left-arrow" onClick={handlePrev}>
                      <FaChevronLeft />
                    </button>
                    <button className="slide-arrow right-arrow" onClick={handleNext}>
                      <FaChevronRight />
                    </button>
                    <div className="slide-indicator">
                      {currentImgIndex + 1} / {discoveredImages.length}
                    </div>
                  </>
                )}

                <button className="expand-btn" onClick={openLightbox} title="Expand View">
                  <FaExpand />
                </button>
              </>
            ) : (
              <span className="no-images-text">Image Placeholder</span>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {isLightboxOpen && hasImages && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={closeLightbox}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-lightbox" onClick={closeLightbox}>
                <FaTimes />
              </button>
              
              <div className="lightbox-image-wrapper">
                <img 
                  src={discoveredImages[currentImgIndex]} 
                  alt={`${project.title} zoomed screenshot`} 
                  className="lightbox-img" 
                />
              </div>

              {discoveredImages.length > 1 && (
                <>
                  <button className="lightbox-arrow left" onClick={handlePrev}>
                    <FaChevronLeft />
                  </button>
                  <button className="lightbox-arrow right" onClick={handleNext}>
                    <FaChevronRight />
                  </button>
                </>
              )}

              <div className="lightbox-caption">
                <h4>{project.title}</h4>
                <p>Screenshot {currentImgIndex + 1} of {discoveredImages.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectCard;
