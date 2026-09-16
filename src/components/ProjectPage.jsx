import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { trackCaseView, trackProposalRequest, trackWhatsAppClick } from '../utils/analytics';

export default function ProjectPage({ project, allProjects, onClose, onNavigate, onContact }) {
  const currentIdx = allProjects.findIndex(p => p.id === project.id);
  const prevProj   = allProjects[currentIdx - 1] || null;
  const nextProj   = allProjects[currentIdx + 1] || null;

  useEffect(() => {
    window.scrollTo(0, 0);
    trackCaseView(project.id, project.title, project.isConceptual);
  }, [project.id, project.title, project.isConceptual]);

  const handleShareWhatsApp = () => {
    trackWhatsAppClick('case_share_button', project.title);
  };

  const handleProposalClick = () => {
    trackProposalRequest(project.id, project.category);
  };

  return (
    <motion.article
      key={project.id}
      className="pp-root"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top nav */}
      <nav className="pp-nav" aria-label="Navegação do Case">
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          className="pp-back"
          onClick={onClose}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          voltar à galeria
        </motion.button>
        <div className="pp-nav-center">
          <img src="/assets/brand/logo-sem-fundo.png" alt="CS Ag" style={{ width: 24, height: 24, objectFit: 'contain' }} />
          <span className="pp-nav-label">Comunicação Social Ag</span>
        </div>
        <div className="pp-nav-right">
          <span className="pp-num">{project.num} / {String(allProjects.length).padStart(2,'0')}</span>
        </div>
      </nav>

      {/* Hero */}
      <header className="pp-hero">
        <motion.div
          className="pp-hero-img-wrap"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={project.image} alt={project.title} className="pp-hero-img" />
          <div className="pp-hero-overlay" style={{ '--accent': project.accent }} />
        </motion.div>
        <div className="pp-hero-content">
          <motion.span
            className="pp-hero-cat"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {project.category}
          </motion.span>
          <motion.h1
            className="pp-hero-title"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            {project.title}
          </motion.h1>
          <motion.div
            className="pp-hero-meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <span>{project.client}</span>
            <span className="pp-hero-sep">—</span>
            <span>{project.year}</span>
            <span className="pp-hero-sep">—</span>
            <span>{project.role}</span>
          </motion.div>
        </div>
      </header>

      {/* Content */}
      <motion.div
        className="pp-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Tags + Conceptual / Verified Case Badge */}
        <div className="pp-tags-row" style={{ alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {project.isConceptual ? (
            <span
              className="pp-tag"
              style={{
                background: 'rgba(247, 212, 6, 0.08)',
                border: '1px dashed rgba(247, 212, 6, 0.45)',
                color: 'var(--gold)',
                fontWeight: 700
              }}
            >
              Estudo Conceitual & Benchmark
            </span>
          ) : (
            <span
              className="pp-tag"
              style={{
                background: 'rgba(37, 211, 102, 0.12)',
                border: '1px solid rgba(37, 211, 102, 0.4)',
                color: '#25d366',
                fontWeight: 700
              }}
            >
              ✓ Case Real Homologado
            </span>
          )}
          {project.tags.map(t => (
            <span key={t} className="pp-tag" style={{ '--accent': project.accent }}>{t}</span>
          ))}
        </div>

        {/* 1. O Desafio & O Pensamento */}
        <section className="pp-section pp-two-col">
          <div className="pp-col">
            <span className="pp-section-label">01 · O Desafio</span>
            <p className="pp-body-text">{project.challenge}</p>
          </div>
          <div className="pp-col">
            <span className="pp-section-label">02 · O Pensamento Estratégico</span>
            <p className="pp-body-text">{project.thought || 'Comunicação estratégica desenhada a partir do diagnóstico profundo do modelo de negócios e das barreiras de conversão reais.'}</p>
          </div>
        </section>

        {/* 2. A Estratégia & A Execução */}
        <section className="pp-section pp-two-col" style={{ paddingTop: 0 }}>
          <div className="pp-col">
            <span className="pp-section-label">03 · A Estratégia</span>
            <p className="pp-body-text">{project.strategy}</p>
          </div>
          <div className="pp-col">
            <span className="pp-section-label">04 · A Execução & Canais</span>
            <p className="pp-body-text">{project.execution || project.details}</p>
          </div>
        </section>

        {/* Divider */}
        <div className="pp-divider" style={{ '--accent': project.accent }} />

        {/* 3. Métricas com CDC Art. 37 Legal Disclosure */}
        <section className="pp-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            <span className="pp-section-label" style={{ marginBottom: 0 }}>05 · O Impacto & Métricas</span>
            <span style={{ fontSize: '11px', color: project.isConceptual ? '#888' : '#25d366', fontStyle: 'italic' }}>
              {project.isConceptual
                ? '* Indicadores projetados em ambiente de benchmark/estudo conceitual de mercado.'
                : '* Métricas aferidas em produção clínica e homologadas pelo cliente.'}
            </span>
          </div>
          <div className="pp-metrics">
            {project.results.map((r, i) => (
              <motion.div
                key={i}
                className="pp-metric"
                style={{ '--accent': project.accent }}
                whileHover={{ y: -3, borderColor: 'rgba(247,212,6,0.35)' }}
                transition={{ duration: 0.2 }}
              >
                <span className="pp-metric-value">{r.value}</span>
                <span className="pp-metric-label">{r.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Gallery / Full image */}
        <section className="pp-gallery-section">
          <div className="pp-gallery-img-wrap">
            <img src={project.image} alt={project.title} className="pp-gallery-img" />
          </div>
          <p className="pp-details-text">{project.details}</p>
        </section>

        {/* Navigation entre projetos */}
        <div className="pp-project-nav">
          {prevProj ? (
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.97 }}
              className="pp-nav-proj pp-nav-prev"
              onClick={() => onNavigate(prevProj)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <span className="pp-nav-proj-label">Projeto anterior</span>
                <span className="pp-nav-proj-title">{prevProj.title}</span>
              </div>
            </motion.button>
          ) : <div />}

          {nextProj ? (
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              className="pp-nav-proj pp-nav-next"
              onClick={() => onNavigate(nextProj)}
            >
              <div style={{ textAlign: 'right' }}>
                <span className="pp-nav-proj-label">Próximo projeto</span>
                <span className="pp-nav-proj-title">{nextProj.title}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          ) : <div />}
        </div>

        {/* CTA final + WhatsApp Direct & Share */}
        <div className="pp-cta-section">
          <p className="pp-cta-text">Quer um projeto assim para a sua marca?</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginTop: 14 }}>
            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href={`https://wa.me/5535999999999?text=${encodeURIComponent(`Olá! Gostaria de conversar com a Comunicação Social Ag sobre um projeto semelhante ao case "${project.title}".`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pp-cta-btn"
              style={{ '--accent': project.accent }}
              onClick={handleProposalClick}
            >
              Fale com a gente
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Veja esse case da Comunicação Social Ag: "${project.title}" - ${typeof window !== 'undefined' ? window.location.origin : ''}/?case=${project.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-case-share"
              title="Compartilhar case no WhatsApp"
              onClick={handleShareWhatsApp}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              Compartilhar no WhatsApp
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href={`https://wa.me/5535999999999?text=${encodeURIComponent(`Olá! Vi o case "${project.title}" (${project.category}) no portfólio da CS Ag e gostaria de solicitar uma proposta comercial para um formato semelhante.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-case-share"
              style={{ background: 'rgba(247,212,6,0.12)', borderColor: 'rgba(247,212,6,0.35)', color: 'var(--gold)' }}
              title="Solicitar proposta similar no WhatsApp"
              onClick={handleProposalClick}
            >
              Solicitar Proposta para este Formato →
            </motion.a>
          </div>
        </div>

        <footer className="pp-footer">
          <span>© {new Date().getFullYear()} Comunicação Social Ag — Todos os direitos reservados</span>
          <span>Poços de Caldas, MG</span>
        </footer>
      </motion.div>
    </motion.article>
  );
}
