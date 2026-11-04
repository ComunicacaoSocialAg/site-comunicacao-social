import { useMemo } from 'react';
import { ArrowLeft, ArrowUpRight, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { AGENCY_CONFIG } from '../data/agency';
import { getStoredPosts } from '../data/marketPosts';
import './market.css';

function isPlainClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

// Renderizador seguro e performático de blocos de Markdown para prosa editorial
function renderMarkdownContent(text) {
  if (!text) return null;
  const blocks = text.trim().split(/\n\s*\n/);

  return blocks.map((block, index) => {
    const trimmed = block.trim();

    // Título H3
    if (trimmed.startsWith('### ')) {
      const heading = trimmed.replace(/^###\s+/, '');
      return <h3 key={index}>{heading}</h3>;
    }

    // Citação / Blockquote
    if (trimmed.startsWith('> ')) {
      const quote = trimmed.replace(/^>\s+/, '');
      return <blockquote key={index}>{parseInline(quote)}</blockquote>;
    }

    // Lista Numerada
    if (/^\d+\.\s+/.test(trimmed)) {
      const items = trimmed.split(/\n/).map((line) => line.replace(/^\d+\.\s+/, '').trim());
      return (
        <ol key={index}>
          {items.map((item, i) => (
            <li key={i}>{parseInline(item)}</li>
          ))}
        </ol>
      );
    }

    // Lista com Marcadores
    if (/^[-*]\s+/.test(trimmed)) {
      const items = trimmed.split(/\n/).map((line) => line.replace(/^[-*]\s+/, '').trim());
      return (
        <ul key={index}>
          {items.map((item, i) => (
            <li key={i}>{parseInline(item)}</li>
          ))}
        </ul>
      );
    }

    // Parágrafo Padrão
    return <p key={index}>{parseInline(trimmed)}</p>;
  });
}

// Analisador inline simples para **negrito** e *itálico*
function parseInline(line) {
  const parts = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(<em key={match.index}>{token.slice(1, -1)}</em>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push(line.substring(lastIndex));
  }

  return parts.length > 0 ? parts : line;
}

export default function MarketArticlePage({ post, slug, onNavigate }) {
  const [copied, setCopied] = useState(false);

  const article = useMemo(() => {
    if (post) return post;
    const posts = getStoredPosts();
    return posts.find((p) => p.slug === slug || p.id === slug) || null;
  }, [post, slug]);

  const relatedPosts = useMemo(() => {
    if (!article) return [];
    const posts = getStoredPosts();
    return posts
      .filter((p) => (p.slug || p.id) !== (article.slug || article.id))
      .slice(0, 2);
  }, [article]);

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNavClick = (event, path) => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.assign(path);
    }
  };

  if (!article) {
    return (
      <main className="market-article-page">
        <div className="market-article-container" style={{ textAlign: 'center', paddingTop: '8rem' }}>
          <h1>Ensaio não encontrado</h1>
          <p style={{ color: 'var(--market-muted)', margin: '1.5rem 0' }}>
            A análise solicitada não está disponível ou foi movida.
          </p>
          <a
            href="/mercado"
            onClick={(e) => handleNavClick(e, '/mercado')}
            className="market-article-share-btn"
          >
            <ArrowLeft size={14} /> Voltar ao índice de Mercado
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="market-article-page">
      {/* Header Fixo */}
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
          <a href="/mercado" onClick={(e) => handleNavClick(e, '/mercado')}>
            <ArrowLeft size={14} /> Índice Mercado
          </a>
          <a
            href={AGENCY_CONFIG.getWhatsAppUrl(
              `Olá! Li o artigo "${article.title}" no Mercado CS Ag e gostaria de conversar sobre a estratégia da minha marca.`
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

      {/* Conteúdo do Artigo */}
      <article className="market-article-container">
        {/* Link Voltar */}
        <a
          href="/mercado"
          className="market-article-back"
          onClick={(e) => handleNavClick(e, '/mercado')}
        >
          <ArrowLeft size={16} /> Voltar para Mercado
        </a>

        {/* Cabeçalho do Artigo */}
        <header className="market-article-header">
          <div className="market-article-meta">
            <span className="market-category-badge">{article.category}</span>
            <time dateTime={article.isoDate}>{article.date}</time>
            <span>{article.readTime}</span>
          </div>

          <h1 className="market-article-title">{article.title}</h1>

          {article.subtitle && (
            <p className="market-article-subtitle">{article.subtitle}</p>
          )}

          <div className="market-article-author-bar">
            <span>Por {article.author || 'Bruno (CS Ag)'}</span>

            <button
              className="market-article-share-btn"
              onClick={handleShare}
              title="Copiar link do artigo"
              aria-label="Compartilhar análise"
            >
              {copied ? (
                <>
                  <Check size={14} color="#f7d406" /> Link copiado!
                </>
              ) : (
                <>
                  <Share2 size={14} /> Compartilhar
                </>
              )}
            </button>
          </div>
        </header>

        {/* Corpo Editorial */}
        <div className="market-article-body">
          {renderMarkdownContent(article.content)}
        </div>

        {/* Caixa de Posicionamento e Conversão Institucional */}
        <div className="market-article-box">
          <h4>Como a Comunicação Social Ag atua neste cenário</h4>
          <p>
            Não vendemos fórmulas genéricas de marketing digital. Analisamos o ecossistema regional,
            estruturamos marcas proprietárias e desenvolvemos plataformas e campanhas que sustentam
            margem e constroem autoridade no mundo real.
          </p>
          <a
            href={AGENCY_CONFIG.getWhatsAppUrl(
              `Olá! Li o ensaio "${article.title}" e gostaria de agendar uma conversa sobre a minha empresa.`
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Conversar sobre este mercado</span>
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Análises Relacionadas */}
        {relatedPosts.length > 0 && (
          <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--market-line)' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--market-white)', marginBottom: '1.5rem', fontWeight: 600 }}>
              Outras leituras recomendadas
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {relatedPosts.map((related) => (
                <a
                  key={related.slug || related.id}
                  href={`/mercado/${related.slug}`}
                  onClick={(e) => {
                    if (isPlainClick(e)) {
                      e.preventDefault();
                      if (onNavigate) onNavigate(`/mercado/${related.slug}`, related);
                      else window.location.assign(`/mercado/${related.slug}`);
                    }
                  }}
                  className="market-entry"
                  style={{ paddingBlock: '1.5rem', borderBottom: 'none' }}
                >
                  <div className="market-entry-meta" style={{ marginBottom: '0.5rem', gap: '1rem' }}>
                    <span className="market-entry-category">{related.category}</span>
                    <span className="market-entry-reading">{related.readTime}</span>
                  </div>
                  <h4 style={{ fontFamily: "var(--font-display, 'Syne', sans-serif)", fontSize: '1.25rem', color: 'var(--market-white)', margin: '0.4rem 0', fontWeight: 700, letterSpacing: '-0.02em' }}>
                    {related.title}
                  </h4>
                </a>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Rodapé */}
      <footer className="market-footer">
        <span>Comunicação Social Ag © {new Date().getFullYear()}</span>
        <span>Poços de Caldas, MG</span>
        <a href="/" onClick={(e) => handleNavClick(e, '/')}>
          Voltar ao Início
        </a>
      </footer>
    </main>
  );
}
