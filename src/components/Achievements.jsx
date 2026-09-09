import React from 'react';
import { assetUrl } from '../utils/assetUrl';
import './Achievements.css';

const Achievements = () => {
  const openLink = (url) => {
    window.open(assetUrl(url), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="achievements" className="achievements-section">
      <h2 className="lumos-header">The Order of Merlin</h2>
      
      <div className="achievements-grid">
        <div 
          className="achievement-card clickable-card"
          onClick={() => openLink("/certificates/mca_degree.pdf")}
          title="Click to reveal MCA scroll"
        >
          <div className="wax-seal"></div>
          <div className="achievement-content">
            <h3>Master of Computer Applications (MCA)</h3>
            <p><strong>Bharathiar University (2024-2026)</strong></p>
            <p>Score: 70%</p>
          </div>
        </div>
        
        <div 
          className="achievement-card clickable-card"
          onClick={() => openLink("/certificates/bsc_degree.pdf")}
          title="Click to reveal B.Sc. scroll"
        >
          <div className="wax-seal"></div>
          <div className="achievement-content">
            <h3>B.Sc. Computer Technology</h3>
            <p><strong>Hindusthan College of Arts & Science (2021-2024)</strong></p>
            <p>Score: 71%</p>
          </div>
        </div>

        <div className="achievement-card">
          <div className="wax-seal"></div>
          <div className="achievement-content">
            <h3>Magical Certifications</h3>
            <ul className="achievement-list">
              <li 
                onClick={() => openLink("/certificates/bi_dashboards.pdf")}
                title="Click to view Certificate"
              >
                BI Dashboards with IBM Cognos Analytics & Google Looker (Coursera)
              </li>
              <li 
                onClick={() => openLink("/certificates/iot.pdf")}
                title="Click to view Certificate"
              >
                Introduction to IoT (NPTEL)
              </li>
              <li 
                onClick={() => openLink("/certificates/photoshop.pdf")}
                title="Click to view Certificate"
              >
                Graphic Design with Photoshop (Great Learning)
              </li>
              <li 
                onClick={() => openLink("/certificates/image_processing.pdf")}
                title="Click to view Certificate"
              >
                Digital Image Processing (MathWorks)
              </li>
              <li 
                onClick={() => openLink("/certificates/power_platform.pdf")}
                title="Click to view Certificate"
              >
                Microsoft Power Platform Fundamentals
              </li>
            </ul>
          </div>
        </div>

        <div className="achievement-card">
          <div className="wax-seal"></div>
          <div className="achievement-content">
            <h3>Honors & Presentations</h3>
            <ul className="achievement-list">
              <li 
                onClick={() => openLink("/certificates/5g_paper.pdf")}
                title="Click to view Paper"
              >
                "5G Technology" Paper at Sri Ramakrishna College
              </li>
              <li 
                onClick={() => openLink("/certificates/crop_yield_paper.pdf")}
                title="Click to view Paper"
              >
                "Crop Yield Prediction Using ML" Paper at SRM Institute
              </li>
              <li 
                onClick={() => openLink("/certificates/transport_layer_wsn_paper.pdf")}
                title="Click to view Paper"
              >
                "Performance of Transport Layer in WSN" Paper at PSGR Krishnammal College
              </li>
              <li 
                onClick={() => openLink("/certificates/symposium_certificate.pdf")}
                title="Click to view Certificate"
              >
                Organizer & Magazine Editor for a National Level Technical Symposium
              </li>
              <li 
                onClick={() => openLink("/certificates/hibot_award.pdf")}
                title="Click to view Award"
              >
                Winner of the HIBOT Poster Designing Competition
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
