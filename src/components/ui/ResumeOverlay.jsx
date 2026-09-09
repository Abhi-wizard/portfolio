import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';
import {
  FaTimes,
  FaDownload,
  FaScroll,
  FaChevronLeft,
  FaChevronRight,
  FaImages,
  FaAward
} from 'react-icons/fa';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import { assetUrl } from '../../utils/assetUrl';
import './ResumeOverlay.css';

// Configure PDF.js worker using bundled local worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const DEFAULT_DOC = {
  url: assetUrl('/resume.pdf'),
  title: 'SACRED CODEX: T. ABHIMANYU (RESUME)',
  recipient: 'TO: THE ESTEEMED RECRUITER',
  address: '4 Privet Drive / Ministry of Innovation',
  downloadName: 'Abhimanyu_Resume.pdf',
  type: 'resume'
};

const ResumeOverlay = () => {
  const { isDocumentOpen, activeDocument, closeDocumentModal } = useMagicalScene();
  const [pdfPages, setPdfPages] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [animStage, setAnimStage] = useState('idle'); // 'idle' | 'opening' | 'open' | 'closing'
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const canvasRefs = useRef([]);
  const renderTasksRef = useRef([]);

  const doc = activeDocument || DEFAULT_DOC;
  const rawImages = doc.images && doc.images.length > 0
    ? doc.images
    : (doc.url && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(doc.url) ? [doc.url] : []);

  const imageList = rawImages.map((img) => assetUrl(img));
  const isImageMode = imageList.length > 0;
  const activeImageUrl = isImageMode ? imageList[activeImgIdx] || imageList[0] : null;
  const targetPdfUrl = !isImageMode && doc.url ? assetUrl(doc.url) : assetUrl('/resume.pdf');

  // Derive download file and link
  const currentDownloadUrl = isImageMode ? activeImageUrl : targetPdfUrl;
  const currentDownloadName = isImageMode
    ? (doc.downloadName ? doc.downloadName.replace(/\.[^.]+$/, `_${activeImgIdx + 1}$&`) : `Certificate_${activeImgIdx + 1}.jpg`)
    : (doc.downloadName || 'Magical_Document.pdf');

  // Trigger envelope opening sequence on modal open
  useEffect(() => {
    if (isDocumentOpen) {
      setAnimStage('opening');
      setActiveImgIdx(0);

      if (!isImageMode && targetPdfUrl) {
        loadPdfDocument(targetPdfUrl);
      } else {
        setPdfLoading(false);
        setPdfError(false);
      }

      const timer = setTimeout(() => {
        setAnimStage('open');
      }, 850);

      return () => clearTimeout(timer);
    } else {
      setAnimStage('idle');
      // Cancel active render tasks
      renderTasksRef.current.forEach((t) => {
        try { t?.cancel(); } catch (e) { /* ignore */ }
      });
      renderTasksRef.current = [];
    }
  }, [isDocumentOpen, targetPdfUrl, isImageMode]);

  // Handle ESC key and Arrow keys for multi-image navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isDocumentOpen) return;
      if (e.key === 'Escape') {
        handleClose();
      } else if (isImageMode && imageList.length > 1) {
        if (e.key === 'ArrowRight') {
          setActiveImgIdx((prev) => (prev + 1) % imageList.length);
        } else if (e.key === 'ArrowLeft') {
          setActiveImgIdx((prev) => (prev - 1 + imageList.length) % imageList.length);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDocumentOpen, isImageMode, imageList.length]);

  const handleClose = () => {
    setAnimStage('closing');
    setTimeout(() => {
      closeDocumentModal();
      setAnimStage('idle');
      setPdfPages([]);
      setActiveImgIdx(0);
    }, 500);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev + 1) % imageList.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const loadPdfDocument = async (url) => {
    setPdfLoading(true);
    setPdfError(false);
    setPdfPages([]);

    // Cancel old render tasks
    renderTasksRef.current.forEach((t) => {
      try { t?.cancel(); } catch (e) { /* ignore */ }
    });
    renderTasksRef.current = [];

    try {
      const loadingTask = pdfjsLib.getDocument(encodeURI(url));
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const pagesArray = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        pagesArray.push(page);
      }

      setPdfPages(pagesArray);
      setPdfLoading(false);

      // Render each page to its corresponding parchment canvas
      setTimeout(() => {
        pagesArray.forEach((page, index) => {
          const canvas = canvasRefs.current[index];
          if (!canvas) return;

          const context = canvas.getContext('2d');
          const dpr = window.devicePixelRatio || 1;
          const containerWidth = Math.min(window.innerWidth * 0.86, 860);
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

          const renderTask = page.render(renderContext);
          renderTasksRef.current.push(renderTask);
        });
      }, 120);
    } catch (err) {
      console.warn('[MagicalDocumentViewer] PDF.js rendering error, falling back to direct embed:', err);
      setPdfError(true);
      setPdfLoading(false);
    }
  };

  if (!isDocumentOpen && animStage === 'idle') {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="resume-overlay-backdrop" onClick={handleClose}>
        {/* Ambient Dark Magic Glow */}
        <div className="resume-overlay-vignette" />
        <div className="resume-floating-particles">
          {Array.from({ length: 22 }).map((_, i) => (
            <div
              key={i}
              className="resume-spark"
              style={{
                left: `${(i * 14.5 + 7) % 96}%`,
                top: `${(i * 19.3 + 11) % 94}%`,
                animationDelay: `${(i * 0.25) % 3.2}s`,
                animationDuration: `${3 + (i % 2.5)}s`
              }}
            />
          ))}
        </div>

        {/* 1. HOGWARTS ACCEPTANCE ENVELOPE OPENING ANIMATION */}
        {animStage === 'opening' && (
          <motion.div
            initial={{ scale: 0.25, rotateY: -160, opacity: 0, y: 80 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: -40 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="magical-envelope-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="envelope-body">
              {/* Envelope Back Interior */}
              <div className="envelope-back" />

              {/* Emerging Letter from inside pocket */}
              <div className="envelope-letter emerging">
                <div className="letter-header-rune">✦ HOGWARTS SCHOLARLY ARCHIVE ✦</div>
                <div className="letter-line" />
                <div className="letter-line short" />
                <div className="letter-line" />
                <div className="letter-seal-stamp">📜</div>
              </div>

              {/* Envelope Folds */}
              <div className="envelope-left-fold" />
              <div className="envelope-right-fold" />
              <div className="envelope-bottom-fold" />
              <div className="envelope-top-flap opened" />

              {/* Wax Seal with monogram */}
              <div className="envelope-wax-seal broken">
                <div className="seal-glow-ring" />
                <span className="seal-monogram">H</span>
              </div>

              {/* Envelope Address in Vintage Calligraphy */}
              <div className="envelope-address-card">
                <p className="envelope-to">{doc.recipient || 'TO: THE SCHOLARLY COUNCIL'}</p>
                <p className="envelope-address">{doc.address || 'Hogwarts Guild / Research Archives'}</p>
              </div>

              {/* Lumos Burst Flash */}
              <div className="envelope-lumos-flash" />
            </div>

            <p className="envelope-summon-caption">
              ✦ UNSEALING ANCIENT CODEX... ✦
            </p>
          </motion.div>
        )}

        {/* 2. FULL-SCREEN SCROLLABLE OLD LETTER / PARCHMENT THEME VIEWER */}
        {(animStage === 'open' || animStage === 'closing') && (
          <motion.div
            initial={{ scale: 0.86, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="resume-viewer-container parchment-theme"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Parchment Header / Ornate Runes */}
            <div className="resume-viewer-header">
              <div className="viewer-title-box">
                <FaScroll className="viewer-scroll-icon" />
                <span className="viewer-title">{doc.title || 'ARCHIVAL CODEX'}</span>
              </div>

              <div className="viewer-actions-box">
                <a
                  href={currentDownloadUrl}
                  download={currentDownloadName}
                  className="viewer-action-btn download"
                  title="Download Document"
                >
                  <FaDownload />
                  <span>DOWNLOAD</span>
                </a>

                <button
                  onClick={handleClose}
                  className="viewer-action-btn close"
                  title="Close Parchment Scroll"
                >
                  <FaTimes />
                  <span>✦ CLOSE SCROLL</span>
                </button>
              </div>
            </div>

            {/* Scrollable Parchment Document Area */}
            <div className="resume-scroll-container">
              {/* PDF Loading Indicator */}
              {pdfLoading && !isImageMode && (
                <div className="pdf-loading-state">
                  <div className="parchment-spinner" />
                  <p>Deciphering Runic Ink from Archival Parchment...</p>
                </div>
              )}

              {/* Image Document Mode (Single or Multi-Certificate Gallery) */}
              {isImageMode && (
                <div className="pdf-pages-list">
                  <div className="pdf-page-wrapper image-doc-wrapper">
                    <div className="page-watermark">
                      ARCHIVAL ILLUMINATED SCROLL ✦ {doc.title}
                      {imageList.length > 1 && ` — CERTIFICATE ${activeImgIdx + 1} OF ${imageList.length}`}
                    </div>

                    <div className="parchment-img-showcase-box">
                      <img
                        src={activeImageUrl}
                        alt={`${doc.title} - Certificate ${activeImgIdx + 1}`}
                        className="parchment-image-document"
                      />

                      {/* Previous / Next Navigation Arrows for Multi-Certificate Mode */}
                      {imageList.length > 1 && (
                        <>
                          <button
                            className="parchment-img-arrow left"
                            onClick={handlePrevImage}
                            title="Previous Certificate"
                          >
                            <FaChevronLeft />
                          </button>
                          <button
                            className="parchment-img-arrow right"
                            onClick={handleNextImage}
                            title="Next Certificate"
                          >
                            <FaChevronRight />
                          </button>
                          <div className="parchment-img-badge">
                            CERTIFICATE {activeImgIdx + 1} / {imageList.length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Selection Row for multi-certificate collections */}
                    {imageList.length > 1 && (
                      <div className="parchment-thumbnails-row">
                        {imageList.map((imgSrc, idx) => (
                          <div
                            key={idx}
                            className={`parchment-thumb-card ${activeImgIdx === idx ? 'active' : ''}`}
                            onClick={() => setActiveImgIdx(idx)}
                            title={`View Certificate ${idx + 1}`}
                          >
                            <img src={imgSrc} alt={`Thumbnail ${idx + 1}`} className="parchment-thumb-img" />
                            <span className="thumb-label">Certificate #{idx + 1}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Multi-Page Canvas Rendering for PDFs */}
              {!pdfLoading && !pdfError && !isImageMode && pdfPages.length > 0 && (
                <div className="pdf-pages-list">
                  {pdfPages.map((_, index) => (
                    <div key={index} className="pdf-page-wrapper">
                      <div className="page-watermark">
                        ARCHIVAL PARCHMENT — FOLIO {index + 1} OF {pdfPages.length}
                      </div>
                      <canvas
                        ref={(el) => (canvasRefs.current[index] = el)}
                        className="pdf-page-canvas"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Direct Embed / Object Fallback if Canvas Rendering was bypassed */}
              {(!pdfLoading && (pdfError || (!isImageMode && pdfPages.length === 0))) && (
                <div className="pdf-embed-fallback">
                  <object
                    data={`${targetPdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                    type="application/pdf"
                    className="pdf-object-frame"
                  >
                    <div className="pdf-no-support">
                      <p>Your magical vessel does not support inline PDF viewing.</p>
                      <a
                        href={targetPdfUrl}
                        download={doc.downloadName || 'Magical_Document.pdf'}
                        className="viewer-action-btn download"
                      >
                        <FaDownload /> Download Direct PDF
                      </a>
                    </div>
                  </object>
                </div>
              )}
            </div>

            {/* Footer Parchment Trim */}
            <div className="resume-viewer-footer">
              <span className="footer-rune">
                ✦ T. ABHIMANYU — MINISTRY & GUILD ARCHIVES ✦
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default ResumeOverlay;
