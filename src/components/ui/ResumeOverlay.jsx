import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';
import {
  FaTimes,
  FaDownload,
  FaScroll,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import { assetUrl } from '../../utils/assetUrl';
import './ResumeOverlay.css';

// Configure PDF.js worker with primary local bundle and CDN worker fallback
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker || `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
} catch (e) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

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

  // Absolute URL for Google Docs Viewer fallback on mobile
  const fullAbsolutePdfUrl = targetPdfUrl.startsWith('http')
    ? targetPdfUrl
    : typeof window !== 'undefined'
      ? `${window.location.origin}${targetPdfUrl}`
      : targetPdfUrl;

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

    const loadOptions = {
      url: encodeURI(url),
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`,
      isEvalSupported: false
    };

    try {
      const loadingTask = pdfjsLib.getDocument(loadOptions);
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const pagesArray = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        pagesArray.push(page);
      }

      setPdfPages(pagesArray);
      setPdfLoading(false);
    } catch (err) {
      console.warn('[MagicalDocumentViewer] Primary PDF.js load error, trying CDN worker fallback:', err);
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
        const fallbackTask = pdfjsLib.getDocument(loadOptions);
        const pdf = await fallbackTask.promise;
        const pagesArray = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          pagesArray.push(await pdf.getPage(i));
        }
        setPdfPages(pagesArray);
        setPdfLoading(false);
      } catch (fallbackErr) {
        console.warn('[MagicalDocumentViewer] PDF.js worker fallback failed, enabling responsive iframe fallback:', fallbackErr);
        setPdfError(true);
        setPdfLoading(false);
      }
    }
  };

  // Dedicated responsive page rendering effect - triggers once modal is fully open and canvases are mounted
  useEffect(() => {
    if (animStage !== 'open' || pdfPages.length === 0 || isImageMode) return;

    // Cancel old render tasks before starting new renders
    renderTasksRef.current.forEach((t) => {
      try { t?.cancel(); } catch (_e) { /* ignore */ }
    });
    renderTasksRef.current = [];

    const renderTimer = setTimeout(() => {
      pdfPages.forEach((page, index) => {
        const canvas = canvasRefs.current[index];
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const screenW = window.innerWidth;
        const isMobile = screenW < 768;
        const containerWidth = isMobile
          ? Math.max(screenW * 0.90, 280)
          : Math.min(screenW * 0.86, 860);

        const unscaledViewport = page.getViewport({ scale: 1 });
        const targetInnerWidth = containerWidth - (isMobile ? 20 : 44);
        const scale = targetInnerWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale: Math.max(scale, 0.35) });

        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        // Reset any existing transform
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.scale(dpr, dpr);

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        try {
          const renderTask = page.render(renderContext);
          renderTasksRef.current.push(renderTask);
        } catch (e) {
          console.warn('Canvas render error on page', index + 1, e);
        }
      });
    }, 60);

    return () => clearTimeout(renderTimer);
  }, [animStage, pdfPages, isImageMode]);

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
                      <canvas
                        ref={(el) => (canvasRefs.current[index] = el)}
                        className="pdf-page-canvas"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Zero-Failure Mobile / Tablet Iframe Fallback if Canvas Rendering is Bypassed */}
              {(!pdfLoading && (pdfError || (!isImageMode && pdfPages.length === 0))) && (
                <div className="pdf-embed-fallback">
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(fullAbsolutePdfUrl)}&embedded=true`}
                    className="pdf-iframe-frame"
                    title={doc.title}
                    frameBorder="0"
                  />
                  <div className="pdf-fallback-footer-bar">
                    <p>Having trouble viewing inline?</p>
                    <a
                      href={targetPdfUrl}
                      download={doc.downloadName || 'Magical_Document.pdf'}
                      className="viewer-action-btn download fallback-dl"
                    >
                      <FaDownload /> Download Direct PDF
                    </a>
                  </div>
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
