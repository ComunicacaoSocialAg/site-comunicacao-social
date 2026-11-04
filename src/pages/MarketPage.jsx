import { useState, useMemo } from 'react';
import { ArrowLeft, ArrowUpRight, Search } from 'lucide-react';
import { AGENCY_CONFIG } from '../data/agency';
import { getStoredPosts } from '../data/marketPosts';
import './market.css';

function isPlainClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export default function MarketPage({ onBack, onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allPosts = useMemo(() => getStoredPosts(), []);

  const categories = useMemo(() => {
    const set = new Set();
    allPosts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['all', ...Array.from(set)];
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.subtitle?.toLowerCase().includes(q) ||
        post.excerpt?.toLowerCase().includes(q) ||
        post.category?.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [allPosts, selectedCategory, searchQuery]);

  const handleArticleClick = (event, post) => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    if (onNavigate) {
      onNavigate(`/mercado/${post.slug}`, post);
    } else {
      window.location.assign(`/mercado/${post.slug}`);
    }
  };

  const handleNavClick = (event, path) => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    if (path === '/' && onBack) {
      onBack();
    } else if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.assign(path);
    }
  };

  return (
    <main className="market-page">
      {/* Header */}
      <header className="market-header">
        <a
          href="/"
          className="market-brand"
          onClick={(e) => handleNavClick(e, '/')}
          aria-label="Início da Comunicação Social Ag"
        >
          <img src="/assets/brand/logo-sem-fundo.png" alt="Logo CS Ag" />
        </a>

        <nav className="market-header-nav" aria-label="Navegação secundária">
          <a href="/" onClick={(e) => handleNavClick(e, '/')}>
            <ArrowLeft size={14} /> Início
          </a>
          <a href="/agencia" onClick={(e) => handleNavClick(e, '/agencia')}>
            Agência
          </a>
          <a href="/abordagem" onClick={(e) => handleNavClick(e, '/abordagem')}>
            Abordagem
          </a>
          <a href="/trabalhos" onClick={(e) => handleNavClick(e, '/trabalhos')}>
            Cases
          </a>
          <a
            href={AGENCY_CONFIG.getWhatsAppUrl(
              'Olá! Li as análises no Mercado CS Ag e gostaria de conversar sobre a estratégia da minha empresa.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="market-header-cta"
          >
            <span>Conversar</span>
            <ArrowUpRight size={14} />
          </a>
        </nav>
      </header>

      {/* Hero da Seção */}
      <section className="market-hero">
        <h1>
          Mercado: dados, fricção e <em>estratégia regional</em>.
        </h1>

        <p className="market-hero-lead">
          Ensaios críticos e visão prática sobre a transformação econômica de Poços de Caldas,
          Sul de Minas e leste paulista. Sem jargões vazios, sem fórmulas prontas: o que realmente
          move marcas de valor no interior.
        </p>
      </section>

      {/* Controles de Filtro e Busca */}
      <section className="market-controls" aria-label="Filtros de ensaios">
        <div className="market-filters" role="group" aria-label="Filtrar por categoria">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`market-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'Todos os ensaios' : cat}
            </button>
          ))}
        </div>

        <div className="market-search">
          <Search size={15} />
          <input
            type="search"
            placeholder="Buscar por tema ou palavra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Buscar ensaios"
          />
        </div>
      </section>

      {/* Lista de Artigos em formato editorial broadsheet */}
      <section className="market-feed" aria-label="Lista de análises">
        {filteredPosts.length === 0 ? (
          <div style={{ padding: '4rem 0', color: 'var(--market-muted)' }}>
            <p>Nenhuma análise encontrada para o termo pesquisado.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article key={post.slug || post.id}>
              <a
                href={`/mercado/${post.slug}`}
                className="market-entry"
                onClick={(e) => handleArticleClick(e, post)}
              >
                <div className="market-entry-meta">
                  <span className="market-entry-category">{post.category}</span>
                  <time className="market-entry-date" dateTime={post.isoDate}>{post.date}</time>
                  <span className="market-entry-reading">{post.readTime}</span>
                </div>

                <h2 className="market-entry-title">{post.title}</h2>

                <p className="market-entry-excerpt">
                  {post.excerpt || post.subtitle}
                </p>

                <span className="market-entry-cta">
                  Ler ensaio completo <ArrowUpRight size={16} />
                </span>
              </a>
            </article>
          ))
        )}
      </section>

      {/* Rodapé da Seção */}
      <footer className="market-footer">
        <span>Comunicação Social Ag © {new Date().getFullYear()}</span>
        <span>Poços de Caldas, MG</span>
        <a href="/editor">
          Acesso Editorial
        </a>
      </footer>
    </main>
  );
}
