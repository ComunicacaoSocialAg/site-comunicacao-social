import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playClickSound, playHoverSound } from '../utils/audio';
import { PROJECTS, CATEGORIES, projectMatchesCategory } from '../data/projects';

export default function ProjectsSection({ onSelectProject, soundEnabled = true }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProjects = activeCategory === 'all'
    ? PROJECTS.slice(0, 8)
    : PROJECTS.filter(p => projectMatchesCategory(p, activeCategory)).slice(0, 8);

  return (
    <section className="speaker-content-section" id="projetos">
      <div className="section-container">
        {/* Header Label */}
        <div className="section-header-tag">
          <span className="tag-number">04</span>
          <span className="tag-line" />
          <span className="tag-title">PROJETOS SELECIONADOS • CASOS REAIS</span>
        </div>

        {/* Section Headline */}
        <div className="section-headline-wrap">
          <h2 className="section-headline">
            Trabalhos que geram valor.
            <span className="headline-muted"> Resultados reais sem promessas vazias.</span>
          </h2>
          <p className="section-lead">
            Estudos de caso documentados com metodologia rigorosa, dados verificáveis e impacto mensurável no negócio dos nossos clientes.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="projects-filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`filter-pill-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                playClickSound(soundEnabled);
                setActiveCategory(cat.id);
              }}
              onMouseEnter={() => playHoverSound(soundEnabled)}
            >
              <span>{cat.label}</span>
              <span className="filter-count">
                {cat.id === 'all'
                  ? PROJECTS.length
                  : PROJECTS.filter(p => projectMatchesCategory(p, cat.id)).length}
              </span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-editorial-grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                className="project-grid-card"
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => {
                  playClickSound(soundEnabled);
                  onSelectProject(project);
                }}
                onMouseEnter={() => playHoverSound(soundEnabled)}
              >
                {/* Project Media Wrapper */}
                <div className="project-card-media-wrap">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="project-card-img"
                    loading="lazy"
                  />
                  <div className="project-card-overlay" />
                  <span className="project-card-badge">{project.category}</span>
                  <span className="project-card-year">{project.year}</span>
                </div>

                {/* Project Card Body */}
                <div className="project-card-body">
                  <div className="project-card-meta">
                    <span className="project-card-num">{project.num}</span>
                    <span className="project-card-client">{project.client}</span>
                  </div>
                  <h3 className="project-card-title">{project.title}</h3>
                  <p className="project-card-desc">{project.description}</p>

                  {/* Highlight Metric */}
                  {project.results && project.results.length > 0 && (
                    <div className="project-highlight-metric">
                      <span className="metric-tag">RESULTADO CHAVE</span>
                      <div className="metric-row">
                        <span className="metric-val">{project.results[0].value}</span>
                        <span className="metric-desc">{project.results[0].label}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Link */}
                  <div className="project-card-action">
                    <span>Explorar Estudo de Caso</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
