import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaGithub,
  FaLinkedin,
  FaGraduationCap,
  FaCode,
  FaBriefcase,
  FaScroll,
  FaCertificate,
  FaLaptopCode,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExpand
} from 'react-icons/fa';
import {
  personalInfo,
  experienceData,
  skillCategories,
  projectData,
  achievementsData
} from '../../data/portfolioData';
import { useMagicalScene } from '../../context/MagicalSceneContext';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { assetUrl } from '../../utils/assetUrl';
import './InnerArchiveScene.css';

const StelaProjectCard = ({ project, idx, onOpenLightbox }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const images = project.images && project.images.length > 0 ? project.images : [];
  const hasImages = images.length > 0;

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="stela-project-card">
      <div className="project-card-badge">PROJECT #{idx + 1}</div>
      <h4 className="project-card-title">{project.title}</h4>
      <p className="project-card-desc">{project.description}</p>

      {/* Project Screenshots Showcase */}
      {hasImages && (
        <div className="stela-project-img-box">
          <img
            src={images[currentImgIndex]}
            alt={`${project.title} screenshot ${currentImgIndex + 1}`}
            className="stela-project-img"
            onClick={() => onOpenLightbox(images, currentImgIndex, project.title)}
          />
          {images.length > 1 && (
            <>
              <button className="stela-img-arrow left-arrow" onClick={handlePrev} title="Previous Screenshot">
                <FaChevronLeft />
              </button>
              <button className="stela-img-arrow right-arrow" onClick={handleNext} title="Next Screenshot">
                <FaChevronRight />
              </button>
              <div className="stela-img-indicator">
                {currentImgIndex + 1} / {images.length}
              </div>
            </>
          )}
          <button
            className="stela-img-expand-btn"
            onClick={() => onOpenLightbox(images, currentImgIndex, project.title)}
            title="Expand Fullscreen"
          >
            <FaExpand />
          </button>
        </div>
      )}

      <div className="project-card-tech">
        <span className="tech-label">Artifacts / Tech:</span>
        <p className="tech-text">{project.techStack}</p>
      </div>
    </div>
  );
};

const InnerArchiveScene = () => {
  const { currentRealm, openResumeModal } = useMagicalScene();
  const mouse = useMouseParallax(0.025);

  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    images: [],
    index: 0,
    title: ''
  });

  if (currentRealm !== 'pathway2') {
    return null;
  }

  const openDocument = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenLightbox = (images, index, title) => {
    setLightboxState({ isOpen: true, images, index, title });
  };

  const handleCloseLightbox = () => {
    setLightboxState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleLightboxNext = (e) => {
    e.stopPropagation();
    setLightboxState((prev) => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length
    }));
  };

  const handleLightboxPrev = (e) => {
    e.stopPropagation();
    setLightboxState((prev) => ({
      ...prev,
      index: (prev.index - 1 + prev.images.length) % prev.images.length
    }));
  };

  return (
    <AnimatePresence>
      <motion.section
        className="innerarchive-scene-wrapper"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Full-Screen Responsive Pathway2 Image */}
        <div
          className="innerarchive-image-container"
          style={{
            transform: `translate3d(${mouse.x * -16}px, ${mouse.y * -12}px, 0)`
          }}
        >
          <img
            src={assetUrl('/assets/images/pathway2.webp')}
            alt="The Inner Sanctuary Pathway"
            className="innerarchive-bg-image"
          />
        </div>

        {/* Ambient Overlays */}
        <div className="innerarchive-moonlight-sheen" />
        <div className="innerarchive-mist-layer mist-one" />
        <div className="innerarchive-mist-layer mist-two" />
        <div className="innerarchive-cinematic-vignette" />

        {/* Floating Arcane Embers */}
        <div className="innerarchive-embers-layer">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="innerarchive-ember"
              style={{
                left: `${(i * 5.8 + 6) % 94}%`,
                top: `${(i * 7.5 + 8) % 85}%`,
                animationDelay: `${(i * 0.4) % 3.5}s`,
                animationDuration: `${3.8 + (i % 3)}s`
              }}
            />
          ))}
        </div>

        {/* Environmental Personal Archive Content */}
        <div className="innerarchive-content-container">
          <motion.div
            initial={{ opacity: 0, letterSpacing: '8px' }}
            animate={{ opacity: 1, letterSpacing: '3px' }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="innerarchive-realm-badge"
          >
            ✦ CHAPTER II: THE INNER ARCHIVE ✦
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="innerarchive-main-title"
          >
            Technical Knowledge & Guild Records
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.0, delay: 0.6 }}
            className="innerarchive-divider"
          >
            <span className="divider-gem">✦</span>
          </motion.div>

          {/* Runic Archive Grid */}
          <div className="innerarchive-grid">
            {/* 1. Projects Pillar (The Dueling Ground) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.7 }}
              className="archive-runic-stela full-width"
            >
              <div className="stela-header">
                <FaLaptopCode className="stela-icon" />
                <h3>THE DUELING GROUND (KEY PROJECTS)</h3>
              </div>
              <div className="stela-projects-grid">
                {projectData.map((project, idx) => (
                  <StelaProjectCard
                    key={project.id || idx}
                    project={project}
                    idx={idx}
                    onOpenLightbox={handleOpenLightbox}
                  />
                ))}
              </div>
            </motion.div>

            {/* 2. Technical Specializations Pillar (Spellbook) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="archive-runic-stela"
            >
              <div className="stela-header">
                <FaCode className="stela-icon" />
                <h3>SPELLBOOK & ARCHITECTURE</h3>
              </div>
              <div className="stela-skill-groups">
                {skillCategories.map((cat, idx) => (
                  <div key={idx} className="stela-group">
                    <span className="stela-group-name">{cat.title}</span>
                    <div className="stela-badges-row">
                      {cat.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="stela-skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 3. Experience Milestones Pillar */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.9 }}
              className="archive-runic-stela"
            >
              <div className="stela-header">
                <FaBriefcase className="stela-icon" />
                <h3>MINISTRY & GUILD ARCHIVES</h3>
              </div>
              <div className="stela-experience-list">
                {experienceData.map((exp, idx) => (
                  <div key={idx} className="stela-exp-record">
                    <div className="stela-exp-top">
                      <strong className="stela-exp-role">{exp.role}</strong>
                      <span className="stela-exp-company">@ {exp.company}</span>
                    </div>
                    <span className="stela-exp-time">{exp.duration}</span>
                    <ul className="stela-exp-bullets">
                      {exp.details.map((detail, dIdx) => (
                        <li key={dIdx}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 4. Scholarly Paper Presentations & Honors */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.0 }}
              className="archive-runic-stela"
            >
              <div className="stela-header">
                <FaScroll className="stela-icon" />
                <h3>PAPER PRESENTATIONS & HONORS</h3>
              </div>
              <div className="stela-honors-list">
                {achievementsData.honors.map((honor, idx) => (
                  <div
                    key={idx}
                    className="stela-honor-item clickable-codex"
                    onClick={() => openDocument(honor.url)}
                    title="Click to view Paper / Certificate"
                  >
                    <div className="honor-bullet-rune">✦</div>
                    <div className="honor-text-box">
                      <span className="honor-name">{honor.name}</span>
                      <span className="honor-view-tag">
                        View Scroll <FaExternalLinkAlt className="mini-ext" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 5. Magical Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.05 }}
              className="archive-runic-stela"
            >
              <div className="stela-header">
                <FaCertificate className="stela-icon" />
                <h3>MAGICAL CERTIFICATIONS</h3>
              </div>
              <div className="stela-honors-list">
                {achievementsData.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="stela-honor-item clickable-codex"
                    onClick={() => openDocument(cert.url)}
                    title="Click to view Certificate"
                  >
                    <div className="honor-bullet-rune">📜</div>
                    <div className="honor-text-box">
                      <span className="honor-name">{cert.name}</span>
                      <span className="honor-view-tag">
                        View Certificate <FaExternalLinkAlt className="mini-ext" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 6. Academic Credentials Pillar */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.1 }}
              className="archive-runic-stela full-width"
            >
              <div className="stela-header">
                <FaGraduationCap className="stela-icon" />
                <h3>ACADEMIC SCROLLS & CREDENTIALS</h3>
              </div>
              <div className="stela-degrees-row">
                {achievementsData.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="stela-degree-card clickable-codex"
                    onClick={() => openDocument(edu.certificateUrl)}
                    title={edu.actionText || 'Click to view degree scroll'}
                  >
                    <div className="wax-seal-mini">✦</div>
                    <h4 className="degree-title">{edu.title}</h4>
                    <p className="degree-institution">{edu.institution}</p>
                    <span className="degree-score">{edu.score}</span>
                    <span className="degree-reveal-prompt">
                      {edu.actionText || 'Click to reveal degree scroll'} <FaExternalLinkAlt className="mini-ext" />
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Actions: Resume & Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.15 }}
            className="innerarchive-actions-row"
          >
            <div className="innerarchive-social-links">
              <a
                href={personalInfo.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="innerarchive-runic-link"
              >
                <FaLinkedin />
                <span>LinkedIn</span>
              </a>
              <a
                href={personalInfo.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="innerarchive-runic-link"
              >
                <FaGithub />
                <span>GitHub</span>
              </a>
            </div>

            <div className="innerarchive-cta-buttons">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  openResumeModal();
                }}
                className="innerarchive-cta-btn secondary"
              >
                <span>View Full Resume</span>
              </button>
              <a
                href={personalInfo.resumePath}
                download="Abhimanyu_Resume.pdf"
                className="innerarchive-cta-btn primary"
              >
                <span>Download Resume ✦</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Project Screenshots Lightbox Modal */}
        {lightboxState.isOpen && lightboxState.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="stela-lightbox-overlay"
            onClick={handleCloseLightbox}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="stela-lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="stela-close-lightbox" onClick={handleCloseLightbox} title="Close">
                <FaTimes />
              </button>

              <div className="stela-lightbox-img-wrap">
                <img
                  src={lightboxState.images[lightboxState.index]}
                  alt={`${lightboxState.title} high-res preview`}
                  className="stela-lightbox-img"
                />
              </div>

              {lightboxState.images.length > 1 && (
                <>
                  <button className="stela-lightbox-arrow left" onClick={handleLightboxPrev} title="Previous">
                    <FaChevronLeft />
                  </button>
                  <button className="stela-lightbox-arrow right" onClick={handleLightboxNext} title="Next">
                    <FaChevronRight />
                  </button>
                </>
              )}

              <div className="stela-lightbox-caption">
                <h4>{lightboxState.title}</h4>
                <p>Screenshot {lightboxState.index + 1} of {lightboxState.images.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.section>
    </AnimatePresence>
  );
};

export default InnerArchiveScene;
