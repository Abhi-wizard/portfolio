import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';
import { FaTimes, FaDownload, FaScroll } from 'react-icons/fa';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import { assetUrl } from '../../utils/assetUrl';
import './ResumeOverlay.css';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;

const ResumeOverlay = () => {
  const { isResumeOpen, closeResumeModal } = useMagicalScene();
  const [pdfPages, setPdfPages] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [animStage, setAnimStage] = useState('idle'); // 'idle' | 'opening' | 'open' | 'closing'
  const canvasRefs = useRef([]);

  const resumePdfPath = assetUrl('/resume.pdf');

  // Trigger stage transitions on modal open/close
  useEffect(() => {
    if (isResumeOpen) {
      setAnimStage('opening');
      loadPdfDocument();

      const timer = setTimeout(() => {
        setAnimStage('open');
      }, 700);

      return () => clearTimeout(timer);
    } else {
      setAnimStage('idle');
    }
  }, [isResumeOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isResumeOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isResumeOpen]);

  const handleClose = () => {
    setAnimStage('closing');
    setTimeout(() => {
      closeResumeModal();
      setAnimStage('idle');
    }, 600);
  };

  const loadPdfDocument = async () => {
    setPdfLoading(true);
    setPdfError(false);

    try {
      const loadingTask = pdfjsLib.getDocument(resumePdfPath);
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const pagesArray = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        pagesArray.push(page);
      }

      setPdfPages(pagesArray);
      setPdfLoading(false);

      // Render each page to canvas
      setTimeout(() => {
        pagesArray.forEach((page, index) => {
          const canvas = canvasRefs.current[index];
          if (!canvas) return;

          const context = canvas.getContext('2d');
          const dpr = window.devicePixelRatio || 1;
          const containerWidth = Math.min(window.innerWidth * 0.88, 880);
          const unscaledViewport = page.getViewport({ scale: 1 });
          const scale = containerWidth / unscaledViewport.width;
          const viewport = page.getViewport({ scale });

          canvas.width = viewport.width * dpr;
          canvas.height = viewport.height * dpr;
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;

          context.scale(dpr, dpr);

          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          page.render(renderContext);
        });
      }, 100);
    } catch (err) {
      console.warn('[ResumeOverlay] PDF.js rendering error, falling back to direct embed:', err);
      setPdfError(true);
      setPdfLoading(false);
    }
  };

  if (!isResumeOpen && animStage === 'idle') {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="resume-overlay-backdrop" onClick={handleClose}>
        {/* Ambient Dark Magic Glow */}
        <div className="resume-overlay-vignette" />
        <div className="resume-floating-particles">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="resume-spark"
              style={{
                left: `${(i * 17) % 100}%`,
                top: `${(i * 23) % 100}%`,
                animationDelay: `${(i * 0.3) % 3}s`
              }}
            />
          ))}
        </div>

        {/* 1. HOGWARTS ACCEPTANCE LETTER OPENING ANIMATION (Step 1) */}
        {animStage === 'opening' && (
          <motion.div
            initial={{ scale: 0.2, rotateY: -180, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="hogwarts-envelope-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="envelope-gold-crest">
              <div className="wax-seal">
                <span className="seal-letter">H</span>
              </div>
            </div>
            <div className="envelope-body">
              <p className="envelope-to">TO: THE ESTEEMED RECRUITER</p>
              <p className="envelope-address">4 Privet Drive / Ministry of Innovation</p>
              <div className="envelope-lumos-flash" />
            </div>
          </motion.div>
        )}

        {/* 2. FULL-SCREEN SCROLLABLE RESUME VIEWER STAGE */}
        {(animStage === 'open' || animStage === 'closing') && (
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="resume-viewer-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Parchment Header / Ornate Runes */}
            <div className="resume-viewer-header">
              <div className="viewer-title-box">
                <FaScroll className="viewer-scroll-icon" />
                <span className="viewer-title">SACRED CODEX: T. ABHIMANYU (RESUME)</span>
              </div>

              <div className="viewer-actions-box">
                <a
                  href={resumePdfPath}
                  download="Abhimanyu_Resume.pdf"
                  className="viewer-action-btn download"
                  title="Download Resume PDF"
                >
                  <FaDownload />
                  <span>DOWNLOAD PDF</span>
                </a>

                <button
                  onClick={handleClose}
                  className="viewer-action-btn close"
                  title="Close Archive Scroll"
                >
                  <FaTimes />
                  <span>✦ CLOSE SCROLL</span>
                </button>
              </div>
            </div>

            {/* Scrollable Document Area */}
            <div className="resume-scroll-container">
              {pdfLoading && (
                <div className="pdf-loading-state">
                  <div className="parchment-spinner" />
                  <p>Deciphering Runic Ink from Archive...</p>
                </div>
              )}

              {!pdfLoading && !pdfError && pdfPages.length > 0 && (
                <div className="pdf-pages-list">
                  {pdfPages.map((_, index) => (
                    <div key={index} className="pdf-page-wrapper">
                      <div className="page-watermark">ARCHIVAL SCROLL — PAGE {index + 1}</div>
                      <canvas
                        ref={(el) => (canvasRefs.current[index] = el)}
                        className="pdf-page-canvas"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Direct Embed / Object Fallback if Canvas Rendering was bypassed */}
              {(!pdfLoading && (pdfError || pdfPages.length === 0)) && (
                <div className="pdf-embed-fallback">
                  <object
                    data={`${resumePdfPath}#toolbar=0&navpanes=0&scrollbar=1`}
                    type="application/pdf"
                    className="pdf-object-frame"
                  >
                    <div className="pdf-no-support">
                      <p>Your magical vessel does not support inline PDF viewing.</p>
                      <a href={resumePdfPath} download="Abhimanyu_Resume.pdf" className="viewer-action-btn download">
                        <FaDownload /> Download Direct PDF
                      </a>
                    </div>
                  </object>
                </div>
              )}
            </div>

            {/* Footer Parchment Trim */}
            <div className="resume-viewer-footer">
              <span className="footer-rune">✦ T. ABHIMANYU — SOFTWARE DEVELOPER & ARCHITECT ✦</span>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default ResumeOverlay;
