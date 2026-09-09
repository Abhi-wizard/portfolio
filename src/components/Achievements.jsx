import React from 'react';
import { useMagicalScene } from '../context/MagicalSceneContext';
import { assetUrl } from '../utils/assetUrl';
import './Achievements.css';

const Achievements = () => {
  const { openDocumentModal } = useMagicalScene();

  const openLink = (docConfig) => {
    if (typeof docConfig === 'string') {
      openDocumentModal({
        url: docConfig,
        title: 'ARCHIVAL RECORD',
        recipient: 'TO: THE SCHOLARLY COUNCIL',
        address: 'Hogwarts Research Guild Archives',
        downloadName: 'Archival_Document.pdf'
      });
    } else {
      openDocumentModal(docConfig);
    }
  };

  return (
    <section id="achievements" className="achievements-section">
      <h2 className="lumos-header">The Order of Merlin</h2>
      
      <div className="achievements-grid">
        <div 
          className="achievement-card clickable-card"
          onClick={() => openLink({
            url: "/certificates/mca_degree.pdf",
            title: "MASTER OF COMPUTER APPLICATIONS (MCA) — DEGREE SCROLL",
            recipient: "TO: THE ACADEMIC SENATE OF BHARATHIAR UNIVERSITY",
            address: "Department of Computer Applications",
            downloadName: "Abhimanyu_MCA_Degree.pdf"
          })}
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
          onClick={() => openLink({
            url: "/certificates/bsc_degree.pdf",
            title: "B.SC. COMPUTER TECHNOLOGY — DEGREE SCROLL",
            recipient: "TO: THE ACADEMIC COUNCIL",
            address: "Hindusthan College of Arts & Science",
            downloadName: "Abhimanyu_BSc_Degree.pdf"
          })}
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
                onClick={() => openLink({
                  url: "/certificates/bi_dashboards.pdf",
                  title: "BI DASHBOARDS WITH IBM COGNOS & GOOGLE LOOKER",
                  recipient: "TO: THE EVALUATION BOARD",
                  address: "Coursera / IBM & Google Cloud Academy",
                  downloadName: "BI_Dashboards_Certificate.pdf"
                })}
                title="Click to view Certificate"
              >
                BI Dashboards with IBM Cognos Analytics & Google Looker (Coursera)
              </li>
              <li 
                onClick={() => openLink({
                  url: "/certificates/iot.pdf",
                  title: "INTRODUCTION TO INTERNET OF THINGS (IOT)",
                  recipient: "TO: NPTEL REVIEW BOARD",
                  address: "NPTEL / IIT Archive",
                  downloadName: "IoT_Certificate.pdf"
                })}
                title="Click to view Certificate"
              >
                Introduction to IoT (NPTEL)
              </li>
              <li 
                onClick={() => openLink({
                  url: "/certificates/photoshop.pdf",
                  title: "GRAPHIC DESIGN WITH PHOTOSHOP",
                  recipient: "TO: GREAT LEARNING ACADEMY",
                  address: "Great Learning Verification Wing",
                  downloadName: "Photoshop_Certificate.pdf"
                })}
                title="Click to view Certificate"
              >
                Graphic Design with Photoshop (Great Learning)
              </li>
              <li 
                onClick={() => openLink({
                  url: "/certificates/image_processing.pdf",
                  title: "DIGITAL IMAGE PROCESSING",
                  recipient: "TO: MATHWORKS RESEARCH WING",
                  address: "MathWorks Academy",
                  downloadName: "Image_Processing_Certificate.pdf"
                })}
                title="Click to view Certificate"
              >
                Digital Image Processing (MathWorks)
              </li>
              <li 
                onClick={() => openLink({
                  url: "/certificates/power_platform.pdf",
                  title: "MICROSOFT POWER PLATFORM FUNDAMENTALS",
                  recipient: "TO: MICROSOFT CERTIFIED PROFESSIONAL GUILD",
                  address: "Microsoft Learn Credential Services",
                  downloadName: "Power_Platform_Certificate.pdf"
                })}
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
                onClick={() => openLink({
                  url: "/paper presentation/5G TECHNOLOGY.pdf",
                  title: "EMERGING TRENDS IN 5G TECHNOLOGY (RESEARCH PRESENTATION)",
                  recipient: "TO: THE SCHOLARLY COUNCIL & CHAIRPERSONS",
                  address: "Sri Ramakrishna College of Arts & Science / Symposium Archives",
                  downloadName: "5G_TECHNOLOGY_Paper.pdf",
                  type: "paper"
                })}
                title="Click to view Paper"
              >
                "5G Technology" Paper at Sri Ramakrishna College
              </li>
              <li 
                onClick={() => openLink({
                  url: "/paper presentation/Crop Predication using ML.pdf",
                  title: "CROP YIELD PREDICTION USING MACHINE LEARNING (RESEARCH PRESENTATION)",
                  recipient: "TO: THE SCIENTIFIC & TECHNICAL REVIEW COMMITTEE",
                  address: "SRM Institute of Science and Technology / National Symposium",
                  downloadName: "Crop_Yield_Prediction_Using_ML.pdf",
                  type: "paper"
                })}
                title="Click to view Paper"
              >
                "Crop Yield Prediction Using ML" Paper at SRM Institute
              </li>
              <li 
                onClick={() => openLink({
                  url: "/certificates/transport_layer_wsn_paper.pdf",
                  title: "PERFORMANCE OF TRANSPORT LAYER IN WIRELESS SENSOR NETWORKS",
                  recipient: "TO: THE DEPARTMENT OF COMPUTER SCIENCE",
                  address: "PSGR Krishnammal College for Women",
                  downloadName: "Transport_Layer_WSN_Paper.pdf",
                  type: "paper"
                })}
                title="Click to view Paper"
              >
                "Performance of Transport Layer in WSN" Paper at PSGR Krishnammal College
              </li>
              <li 
                onClick={() => openLink({
                  url: "/certificates/symposium_certificate.pdf",
                  title: "NATIONAL LEVEL TECHNICAL SYMPOSIUM — EDITORIAL & LEADERSHIP MERIT",
                  recipient: "TO: THE EXECUTIVE COMMITTEE & PATRONS",
                  address: "National Level Technical Symposium Directorate",
                  downloadName: "Symposium_Organizer_Certificate.pdf"
                })}
                title="Click to view Certificate"
              >
                Organizer & Magazine Editor for a National Level Technical Symposium
              </li>
              <li 
                onClick={() => openLink({
                  url: "/Achivements/poster making/POSTER MAKING CERTIFICATE1.jpg",
                  images: [
                    "/Achivements/poster making/POSTER MAKING CERTIFICATE1.jpg",
                    "/Achivements/poster making/poster making certificate1.jpeg",
                    "/Achivements/poster making/poster making3.jpeg"
                  ],
                  title: "COLLEGE LEVEL POSTER DESIGN COMPETITIONS — MERIT CERTIFICATES",
                  recipient: "TO: THE DESIGN JURY & ACADEMIC EVALUATION COMMITTEE",
                  address: "Department of Computer Technology / Inter-College Technical Fest",
                  downloadName: "Poster_Design_Certificate.jpg",
                  type: "award"
                })}
                title="Click to view Certificates"
              >
                College Level Poster Design Competitions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
