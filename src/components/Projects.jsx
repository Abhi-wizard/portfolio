import React from 'react';
import ProjectCard from './ProjectCard';
import { projectData } from '../data/portfolioData';
import './Projects.css';

const Projects = () => {
  return (
    <section id="projects" className="projects-section">
      <h2 className="lumos-header">The Dueling Ground</h2>
      <div className="projects-container">
        {projectData.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
