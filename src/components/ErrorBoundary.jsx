import React from 'react';

export default function ErrorBoundary({ children }) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const errorHandler = (error) => {
      console.error("Caught error in ErrorBoundary:", error);
      setHasError(true);
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#070708',
        color: '#fff',
        padding: 32,
        textAlign: 'center',
        fontFamily: 'var(--fb)'
      }}>
        <img src="/assets/brand/logo-sem-fundo.png" alt="CS Ag" style={{ width: 48, marginBottom: 20 }} />
        <h2 style={{ fontFamily: 'var(--fh)', color: 'var(--gold)', marginBottom: 12, fontSize: '22px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Experiência 3D Indisponível
        </h2>
        <p style={{ color: '#aaa', maxWidth: 480, marginBottom: 28, fontSize: '14px', lineHeight: 1.6 }}>
          O seu navegador ou dispositivo encontrou uma limitação gráfica. Você pode recarregar a página ou navegar pelos nossos canais institucionais diretos.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'var(--gold)',
              color: '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: 8,
              fontWeight: 700,
              fontFamily: 'var(--fh)',
              cursor: 'pointer'
            }}
          >
            Recarregar Experiência
          </button>
          <a
            href="https://cliente.comunicacaosocialag.com.br"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: 8,
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: 'var(--fh)'
            }}
          >
            Área do Cliente
          </a>
        </div>
      </div>
    );
  }

  return children;
}
