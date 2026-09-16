import React from 'react';
import { motion } from 'motion/react';
import { PROJECTS, CATEGORIES, projectMatchesCategory } from '../data/projects';
import { playClickSound } from '../utils/audio';

export default function ListSidebar({
  activeCategory,
  onSelectCategory,
  soundEnabled,
  onClose,
  onSelect
}) {
  const filteredProjects = PROJECTS.filter(p => projectMatchesCategory(p, activeCategory));

  return (
    <div className="sidebar-root">
      <motion.div
        className="sidebar-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
        onClick={onClose}
      />
      <motion.aside
        className="sidebar"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
      >
        <header className="sidebar-head">
          <div>
            <p className="sidebar-title">Todos os projetos</p>
            <p className="sidebar-count">{filteredProjects.length} de {PROJECTS.length} cases</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="btn-icon"
            onClick={onClose}
            aria-label="Fechar índice de projetos"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M2 2l11 11M13 2L2 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </motion.button>
        </header>

        {/* Categories Chips */}
        <div className="sidebar-filter-row">
          {CATEGORIES.map(cat => {
            const count = cat.id === 'all'
              ? PROJECTS.length
              : PROJECTS.filter(p => projectMatchesCategory(p, cat.id)).length;
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className={`sidebar-chip ${isActive ? 'active' : ''}`}
                onClick={() => {
                  playClickSound(soundEnabled);
                  onSelectCategory(cat.id);
                }}
              >
                {cat.label} ({count})
              </motion.button>
            );
          })}
        </div>

        <motion.ul
          className="sidebar-list"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.035, delayChildren: 0.06 }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {filteredProjects.map(p => (
            <motion.li
              key={p.id}
              variants={{
                hidden: { opacity: 0, x: -14 },
                show: { opacity: 1, x: 0, transition: { duration: 0.26, ease: "easeOut" } }
              }}
              className="sidebar-item"
              whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.04)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playClickSound(soundEnabled);
                onSelect(p);
              }}
            >
              <span className="si-num">{p.num}</span>
              <div className="si-left">
                <span className="si-title">{p.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                  <span className="si-cat">{p.category}</span>
                  <span className="pill-mono">{p.year}</span>
                  {p.tags && p.tags.slice(0, 2).map(t => (
                    <span key={t} className="pill-mono">#{t}</span>
                  ))}
                </div>
              </div>
              <div className="si-right">
                <span className="si-client">{p.client}</span>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </motion.aside>
    </div>
  );
}
