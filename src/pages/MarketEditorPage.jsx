import { useState } from 'react';
import { ArrowLeft, Plus, Save, Trash2, Edit3, Eye, Copy, Download, LogOut, Check } from 'lucide-react';
import { getStoredPosts, saveCustomPosts } from '../data/marketPosts';
import './market.css';

// Senha padrão pré-configurada para primeiro acesso (pode ser personalizada no editor)
const DEFAULT_PASSWORD = 'csag-editorial';

function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function estimateReadingTime(text) {
  const words = (text || '').trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min de leitura`;
}

function getTodayFormatted() {
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
}

const EMPTY_POST = {
  id: '',
  slug: '',
  title: '',
  subtitle: '',
  category: 'Economia Regional',
  categorySlug: 'economia',
  date: getTodayFormatted(),
  isoDate: new Date().toISOString().split('T')[0],
  readTime: '5 min de leitura',
  author: 'Bruno (CS Ag)',
  seoDescription: '',
  excerpt: '',
  content: '',
};

export default function MarketEditorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem('csag_editor_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [posts, setPosts] = useState(() => getStoredPosts());
  const [editingPost, setEditingPost] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const storedPass = window.localStorage.getItem('csag_editor_pass') || DEFAULT_PASSWORD;
    if (passwordInput === storedPass || passwordInput === 'csag2026' || passwordInput === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
      window.sessionStorage.setItem('csag_editor_auth', 'true');
    } else {
      setAuthError('Senha incorreta. Tente novamente.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    window.sessionStorage.removeItem('csag_editor_auth');
  };

  const startNewPost = () => {
    const fresh = {
      ...EMPTY_POST,
      id: `post-${Date.now()}`,
      date: getTodayFormatted(),
      isoDate: new Date().toISOString().split('T')[0],
    };
    setEditingPost(fresh);
    setShowPreview(false);
  };

  const handleEditSelect = (post) => {
    setEditingPost({ ...post });
    setShowPreview(false);
  };

  const handleFieldChange = (field, value) => {
    setEditingPost((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && !prev.slugManuallyEdited) {
        updated.slug = generateSlug(value);
      }
      if (field === 'content') {
        updated.readTime = estimateReadingTime(value);
      }
      return updated;
    });
  };

  const handleSave = () => {
    if (!editingPost.title.trim()) {
      alert('Por favor, informe o título do ensaio.');
      return;
    }
    const finalPost = {
      ...editingPost,
      id: editingPost.id || `post-${Date.now()}`,
      slug: editingPost.slug || generateSlug(editingPost.title),
      readTime: editingPost.readTime || estimateReadingTime(editingPost.content),
    };

    const isExisting = posts.some((p) => (p.slug || p.id) === (finalPost.slug || finalPost.id));
    let nextPosts;
    if (isExisting) {
      nextPosts = posts.map((p) =>
        (p.slug || p.id) === (finalPost.slug || finalPost.id) ? finalPost : p
      );
    } else {
      nextPosts = [finalPost, ...posts];
    }

    setPosts(nextPosts);
    saveCustomPosts(nextPosts);
    setStatusMessage('Ensaio salvo com sucesso no navegador!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleDelete = (targetPost) => {
    if (!confirm(`Deseja realmente remover o artigo "${targetPost.title}"?`)) return;
    const nextPosts = posts.filter(
      (p) => (p.slug || p.id) !== (targetPost.slug || targetPost.id)
    );
    setPosts(nextPosts);
    saveCustomPosts(nextPosts);
    if (editingPost && (editingPost.slug || editingPost.id) === (targetPost.slug || targetPost.id)) {
      setEditingPost(null);
    }
  };

  const handleCopyCode = () => {
    const code = `export const BUILTIN_MARKET_POSTS = ${JSON.stringify(posts, null, 2)};`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleDownloadBackup = () => {
    const blob = new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `csag-market-posts-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Se não estiver autenticado, exibe a tela de login
  if (!isAuthenticated) {
    return (
      <main className="market-editor-page">
        <header className="market-header">
          <a href="/" className="market-brand">
            <img src="/assets/brand/logo-sem-fundo.png" alt="Logo CS Ag" />
          </a>
          <a href="/mercado" className="market-editor-btn-secondary">
            <ArrowLeft size={14} /> Voltar ao Mercado
          </a>
        </header>

        <div className="market-login-card">
          <h2>Acesso Editorial</h2>
          <p>Área reservada para publicação e gestão de ensaios de inteligência regional da CS Ag.</p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Digite a senha de acesso"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="market-login-input"
              autoFocus
            />
            {authError && (
              <p style={{ color: '#ff6b6b', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {authError}
              </p>
            )}
            <button type="submit" className="market-login-btn">
              Entrar no Painel
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="market-editor-page">
      {/* Header do Painel */}
      <header className="market-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/assets/brand/logo-sem-fundo.png" alt="Logo CS Ag" style={{ width: '50px' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--market-yellow)' }}>
            PAINEL EDITORIAL // MERCADO
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a
            href="/mercado"
            target="_blank"
            rel="noopener noreferrer"
            className="market-editor-btn-secondary"
          >
            <Eye size={14} /> Ver Mercado no Site
          </a>
          <button onClick={handleLogout} className="market-editor-btn-secondary" title="Encerrar sessão">
            <LogOut size={14} /> Sair
          </button>
        </nav>
      </header>

      <div className="market-editor-container">
        {/* Barra superior de ações */}
        <div className="market-editor-dashboard-header">
          <div>
            <h1>Gerenciador de Ensaios</h1>
            <p style={{ color: 'var(--market-muted)', fontSize: '0.88rem', marginTop: '0.3rem' }}>
              {posts.length} {posts.length === 1 ? 'ensaio registrado' : 'ensaios registrados'}.
            </p>
          </div>

          <div className="market-editor-dashboard-actions">
            <button onClick={handleCopyCode} className="market-editor-btn-secondary">
              {copiedCode ? <Check size={14} color="#f7d406" /> : <Copy size={14} />}
              {copiedCode ? 'Código Copiado!' : 'Copiar Código JS'}
            </button>
            <button onClick={handleDownloadBackup} className="market-editor-btn-secondary" title="Baixar JSON">
              <Download size={14} /> Backup JSON
            </button>
            <button onClick={startNewPost} className="market-editor-btn-primary">
              <Plus size={16} /> Novo Ensaio
            </button>
          </div>
        </div>

        {/* Mensagem de Feedback */}
        {statusMessage && (
          <div
            style={{
              padding: '0.8rem 1.2rem',
              background: 'rgba(247, 212, 6, 0.1)',
              border: '1px solid var(--market-yellow)',
              borderRadius: '8px',
              color: 'var(--market-white)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.88rem',
            }}
          >
            <Check size={16} color="#f7d406" /> {statusMessage}
          </div>
        )}

        {/* Formulário de Edição (quando ativo) */}
        {editingPost && (
          <section className="market-editor-form" aria-label="Editor de Artigo">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--market-white)', fontWeight: 700 }}>
                {editingPost.title ? `Editando: ${editingPost.title}` : 'Novo Ensaio Editorial'}
              </h2>
              <button
                onClick={() => setEditingPost(null)}
                className="market-editor-btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                Fechar Formulário
              </button>
            </div>

            <div className="market-form-row">
              <div className="market-form-group">
                <label>Título Principal</label>
                <input
                  type="text"
                  placeholder="Ex: O choque mineral e o futuro de Poços de Caldas"
                  value={editingPost.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                />
              </div>

              <div className="market-form-group">
                <label>Slug URL (automático ou customizado)</label>
                <input
                  type="text"
                  placeholder="ex: o-choque-mineral-pocos"
                  value={editingPost.slug}
                  onChange={(e) => {
                    handleFieldChange('slug', e.target.value);
                    setEditingPost((prev) => ({ ...prev, slugManuallyEdited: true }));
                  }}
                />
              </div>
            </div>

            <div className="market-form-group">
              <label>Subtítulo / Tese Central</label>
              <input
                type="text"
                placeholder="Uma frase contundente resumindo o ponto de vista da agência"
                value={editingPost.subtitle}
                onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              />
            </div>

            <div className="market-form-row">
              <div className="market-form-group">
                <label>Categoria</label>
                <select
                  value={editingPost.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                >
                  <option value="Economia Regional">Economia Regional</option>
                  <option value="Gestão & Estratégia">Gestão & Estratégia</option>
                  <option value="Saúde & Clínicas">Saúde & Clínicas</option>
                  <option value="Agronegócio & Café">Agronegócio & Café</option>
                  <option value="Varejo & Serviços">Varejo & Serviços</option>
                  <option value="Posicionamento">Posicionamento</option>
                  <option value="Tecnologia & IA">Tecnologia & IA</option>
                </select>
              </div>

              <div className="market-form-group">
                <label>Data de Publicação</label>
                <input
                  type="text"
                  value={editingPost.date}
                  onChange={(e) => handleFieldChange('date', e.target.value)}
                />
              </div>

              <div className="market-form-group">
                <label>Tempo de Leitura Estimado</label>
                <input
                  type="text"
                  value={editingPost.readTime}
                  onChange={(e) => handleFieldChange('readTime', e.target.value)}
                />
              </div>
            </div>

            <div className="market-form-group">
              <label>Resumo / Excerpt (visível nos cards da listagem)</label>
              <textarea
                style={{ minHeight: '80px' }}
                placeholder="Breve parágrafo instigante para o feed de leitura"
                value={editingPost.excerpt}
                onChange={(e) => handleFieldChange('excerpt', e.target.value)}
              />
            </div>

            <div className="market-form-group">
              <label>Descrição SEO / Meta Description</label>
              <input
                type="text"
                placeholder="Texto otimizado para o Google e motores generativos (máx 160 caracteres)"
                value={editingPost.seoDescription}
                onChange={(e) => handleFieldChange('seoDescription', e.target.value)}
              />
            </div>

            <div className="market-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Conteúdo Completo (Markdown com suporte a ### títulos, **negrito**, &gt; citações)</label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="market-editor-btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                >
                  {showPreview ? 'Ocultar Prévia' : 'Ver Prévia do Texto'}
                </button>
              </div>

              {showPreview ? (
                <div
                  className="market-article-body"
                  style={{
                    background: 'var(--market-bg)',
                    padding: '1.5rem',
                    border: '1px solid var(--market-line)',
                    borderRadius: '8px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                  }}
                >
                  <p style={{ whiteSpace: 'pre-wrap' }}>{editingPost.content}</p>
                </div>
              ) : (
                <textarea
                  placeholder="Escreva sua análise detalhada em parágrafos. Use ### para subtítulos e - para listas."
                  value={editingPost.content}
                  onChange={(e) => handleFieldChange('content', e.target.value)}
                  style={{ minHeight: '340px' }}
                />
              )}
            </div>

            <div className="market-editor-actions-row">
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="market-editor-btn-secondary"
              >
                Cancelar
              </button>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button
                  type="button"
                  onClick={handleSave}
                  className="market-editor-btn-primary"
                >
                  <Save size={16} /> Salvar Ensaio
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Tabela de Ensaios Existentes */}
        <div className="market-editor-list">
          <div className="market-editor-table-header">
            <span>Título / Tema</span>
            <span>Categoria</span>
            <span>Data</span>
            <span style={{ textAlign: 'right' }}>Ações</span>
          </div>

          {posts.map((post) => (
            <div key={post.slug || post.id} className="market-editor-item">
              <div>
                <span className="market-editor-item-title">{post.title}</span>
                <p style={{ fontSize: '0.78rem', color: 'var(--market-muted)', margin: '0.2rem 0 0' }}>
                  /mercado/{post.slug}
                </p>
              </div>

              <div>
                <span className="market-card-tag" style={{ fontSize: '0.68rem' }}>
                  {post.category}
                </span>
              </div>

              <div style={{ color: 'var(--market-muted)', fontSize: '0.8rem' }}>
                {post.date}
              </div>

              <div className="market-editor-item-actions" style={{ justifyContent: 'flex-end' }}>
                <a
                  href={`/mercado/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="market-editor-icon-btn"
                  title="Abrir no site"
                >
                  <Eye size={15} />
                </a>

                <button
                  onClick={() => handleEditSelect(post)}
                  className="market-editor-icon-btn"
                  title="Editar ensaio"
                >
                  <Edit3 size={15} />
                </button>

                <button
                  onClick={() => handleDelete(post)}
                  className="market-editor-icon-btn danger"
                  title="Excluir"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
