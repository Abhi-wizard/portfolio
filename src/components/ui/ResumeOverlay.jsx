import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaDownload, FaScroll } from 'react-icons/fa';
import * as pdfjsLib from 'pdfjs-dist';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import './ResumeOverlay.css';

// Set up PDF.js worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('PDF.js worker initialization:', e);
}

const ResumeOverlay = () => {
  const { isResumeOpen, closeResumeModal } = useMagicalScene();
  const [animStage, setAnimStage] = useState('idle'); // 'idle' | 'envelope' | 'breaking' | 'opening' | 'emerging' | 'viewer' | 'closing'
  const [pdfPages, setPdfPages] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const canvasRefs = useRef([]);

  // Lock background scroll when open
  useEffect(() => {
    if (isResumeOpen) {
      document.body.style.overflow = 'hidden';
      startOpenSequence();
    } else {
      document.body.style.overflow = 'unset';
      setAnimStage('idle');
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isResumeOpen]);

  // Envelope Opening Choreography
  const startOpenSequence = () => {
    setAnimStage('envelope');

    // 1. Envelope floats in, then seal glows
    setTimeout(() => {
      setAnimStage('breaking');
    }, 700);

    // 2. Seal breaks and flap folds open
    setTimeout(() => {
      setAnimStage('opening');
    }, 1400);

    // 3. Document parchment emerges from inside
    setTimeout(() => {
      setAnimStage('emerging');
    }, 2000);

    // 4. Document expands into full readable viewer
    setTimeout(() => {
      setAnimStage('viewer');
      loadPdfDocument();
    }, 2700);
  };

  const handleClose = () => {
    setAnimStage('closing');
    setTimeout(() => {
      closeResumeModal();
      setAnimStage('idle');
    }, 600);
  };

  // Load and render PDF pages via PDF.js onto canvases
  const loadPdfDocument = async () => {
    setPdfLoading(true);
    setPdfError(false);

    try {
      const loadingTask = pdfjsLib.getDocument('/resume.pdf');
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
          const scale = (containerWidth / unscaledViewport.width) * 1.5;
          const viewport = page.getViewport({ scale });

          canvas.width = viewport.width * dpr;
          canvas.height = viewport.height * dpr;
          canvas.style.width = `${viewport.width / (dpr * 1.5)}px`;
          canvas.style.height = `${viewport.height / (dpr * 1.5)}px`;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null
          };

          page.render(renderContext);
        });
      }, 100);
    } catch (err) {
      console.warn('PDF.js rendering fallback triggered:', err);
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
        {/* Ambient Darkened Glass Overlay with floating sparks */}
        <div className="resume-overlay-vignette" />
        <div className="resume-floating-particles">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="resume-spark"
              style={{
                left: `${(i * 6.2 + 8) % 92}%`,
                top: `${(i * 7.8 + 10) % 85}%`,
                animationDelay: `${(i * 0.3) % 2.5}s`
              }}
            />
          ))}
        </div>

        {/* 1. ENVELOPE STAGE ANIMATION */}
        {animStage !== 'viewer' && animStage !== 'closing' && (
          <div
            className={`magical-envelope-wrapper ${animStage}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* The Envelope Body */}
            <div className="envelope-body">
              {/* Back Flap Pocket */}
              <div className="envelope-back" />

              {/* Emerging Parchment Scroll */}
              <div
                className={`envelope-letter ${
                  animStage === 'emerging' || animStage === 'opening' ? 'emerging' : ''
                }`}
              >
                <div className="letter-inner">
                  <div className="letter-header-rune">✦ T. ABHIMANYU ✦</div>
                  <div className="letter-line" />
                  <div className="letter-line short" />
                  <div className="letter-line" />
                </div>
              </div>

              {/* Left & Right Folds */}
              <div className="envelope-left-fold" />
              <div className="envelope-right-fold" />
              <div className="envelope-bottom-fold" />

              {/* Top Triangle Flap */}
              <div
                className={`envelope-top-flap ${
                  animStage === 'opening' || animStage === 'emerging' ? 'opened' : ''
                }`}
              />

              {/* Hogwarts Wax Seal */}
              <div
                className={`envelope-wax-seal ${
                  animStage === 'breaking' || animStage === 'opening' || animStage === 'emerging'
                    ? 'broken'
                    : ''
                }`}
              >
                <div className="seal-glow-ring" />
                <div className="seal-monogram">⚡</div>
              </div>
            </div>

            <div className="envelope-summon-caption">
              ✦ SUMMONING THE ARCHIVE SCROLL... ✦
            </div>
          </div>
        )}

        {/* 2. FULL-SCREEN SCROLLABLE RESUME VIEWER STAGE */}
        {(animStage === 'viewer' || animStage === 'closing') && (
          <motion.div
            className="resume-viewer-container"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Parchment Header Bar */}
            <div className="resume-viewer-header">
              <div className="viewer-title-box">
                <FaScroll className="viewer-scroll-icon" />
                <span className="viewer-title">SACRED CODEX: T. ABHIMANYU (RESUME)</span>
              </div>

              <div className="viewer-actions-box">
                <a
                  href="/resume.pdf"
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

            {/* Scrollable Document Area (Only this container scrolls!) */}
            <div className="resume-scroll-container">
              {pdfLoading && (
                <div className="pdf-loading-state">
                  <div className="parchment-spinner" />
                  <p>Deciphering Runic Ink from Archive...</p>
                </div>
              )}

              {/* Render Canvas Pages if PDF.js loaded pages */}
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
                    data="/resume.pdf#toolbar=0&navpanes=0&scrollbar=1"
                    type="application/pdf"
                    className="pdf-object-frame"
                  >
                    <div className="pdf-no-support">
                      <p>Your magical vessel does not support inline PDF viewing.</p>
                      <a href="/resume.pdf" download="Abhimanyu_Resume.pdf" className="viewer-action-btn download">
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
