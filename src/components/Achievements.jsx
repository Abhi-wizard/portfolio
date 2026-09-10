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
            url: assetUrl("/bharathiar university/bu.jpeg"),
            title: "MASTER OF COMPUTER APPLICATIONS (MCA) — BHARATHIAR UNIVERSITY",
            recipient: "TO: THE ACADEMIC SENATE OF BHARATHIAR UNIVERSITY",
            address: "Department of Computer Applications, Coimbatore",
            downloadName: "Abhimanyu_MCA_Degree.jpg"
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
            url: assetUrl("/hindhustan/hicas.jpeg"),
            title: "B.SC. COMPUTER TECHNOLOGY — HINDUSTHAN COLLEGE",
            recipient: "TO: THE ACADEMIC COUNCIL",
            address: "Hindusthan College of Arts & Science, Coimbatore",
            downloadName: "Abhimanyu_BSc_Degree.jpg"
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
                  url: assetUrl("/Achivements/certificates/IBM.jpeg"),
                  title: "BI DASHBOARDS WITH IBM COGNOS & GOOGLE LOOKER",
                  recipient: "TO: THE EVALUATION BOARD",
                  address: "Coursera / IBM & Google Cloud Academy",
                  downloadName: "IBM_Cognos_Looker_Certificate.jpeg",
                  type: "certificate"
                })}
                title="Click to view Certificate"
              >
                BI Dashboards with IBM Cognos Analytics & Google Looker (Coursera)
              </li>
              <li 
                onClick={() => openLink({
                  url: assetUrl("/Achivements/certificates/Iot certificate.pdf"),
                  title: "INTRODUCTION TO INTERNET OF THINGS (IOT)",
                  recipient: "TO: NATIONAL PROGRAMME ON TECHNOLOGY ENHANCED LEARNING",
                  address: "NPTEL / IIT Kharagpur Archive",
                  downloadName: "IoT_NPTEL_Certificate.pdf",
                  type: "certificate"
                })}
                title="Click to view Certificate"
              >
                Introduction to IoT (NPTEL)
              </li>
              <li 
                onClick={() => openLink({
                  url: assetUrl("/Achivements/poster making/POSTER MAKING CERTIFICATE1.jpg"),
                  images: [
                    assetUrl("/Achivements/poster making/POSTER MAKING CERTIFICATE1.jpg"),
                    assetUrl("/Achivements/poster making/poster making certificate1.jpeg"),
                    assetUrl("/Achivements/poster making/poster making3.jpeg")
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

        <div className="achievement-card">
          <div className="wax-seal"></div>
          <div className="achievement-content">
            <h3>Honors & Presentations</h3>
            <ul className="achievement-list">
              <li 
                onClick={() => openLink({
                  url: assetUrl("/paper presentation/5G TECHNOLOGY.pdf"),
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
                  url: assetUrl("/paper presentation/Crop Predication using ML.pdf"),
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
                  url: assetUrl("/Achivements/magazine/MAGAZINE CTECH 2K24 (1).pdf"),
                  title: "NATIONAL LEVEL TECHNICAL SYMPOSIUM MAGAZINE (CTECH 2K24)",
                  recipient: "TO: THE EDITORIAL BOARD & SCHOLARLY COUNCIL",
                  address: "Department of Computer Technology / Symposium Publications",
                  downloadName: "Magazine_CTech_2k24.pdf",
                  type: "paper"
                })}
                title="Click to view Magazine"
              >
                Organizer & Magazine Editor for a National Level Technical Symposium
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
