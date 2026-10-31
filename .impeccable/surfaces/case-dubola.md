# Dubola: da embalagem à brasa

Modo: Experience e Persuade. Case completo de cliente em `/trabalhos/dubola`, com arquitetura editorial inspirada em estúdios globais de referência (Phantom.land) e coreografia de movimento controlada via GSAP ScrollTrigger.

## Direction contract

THESIS: apresentar um ecossistema completo de comunicação integrada, da identidade e da arquitetura de embalagens ao catálogo comercial, experiência digital e presença em festivais de churrasco, sem inventar métricas comerciais.

OWN-WORLD: palco escuro contínuo (`#070709` e `#110d0c`), pranchas bordô (`#7c241f`) e douradas (`#f2c445`), fotografia gastronômica de mesa rústica com ingredientes frescos e lâminas originais do catálogo `O jeito Dubola de ser.pdf`.

STORY: impacto imediato no hero com ficha técnica estruturada (Cliente, Indústria, Categoria e Entregas), visão estratégica (O desafio e O pensamento), quatro capítulos numerados (01 Branding, 02 Embalagens, 03 Catálogo & Digital, 04 Presença), ativação em eventos (05 Eventos) e chamada de alta conversão para novos projetos.

FIRST VIEWPORT: hero de tela inteira com a composição fotográfica das três embalagens de ketchup Dubola sobre mesa de madeira escura cercadas por tomates, goiabas, pimentas e ervas (`hero-mesa.webp`), título tipográfico com revelação em máscara à esquerda e barra inferior de metadados (Cliente, Indústria, Categoria e Entregas).

FORM: grid editorial assimétrico de 12 colunas (`full`, `half`, `half-tall`, `narrow`, `wide-right`, `wide-left`, `narrow-right`), sem legendas visíveis sob as peças das galerias para valorizar a direção de arte e a tipografia das próprias lâminas. Movimento condicionado a `prefers-reduced-motion: no-preference`.

## Evidência de implementação

- `src/data/clientCases.js` concentra os metadados (`industry`, `category`, `meta`), o hero (`hero-mesa.webp`), a assinatura (`como-deve-ser.webp`), o logo (`logo-dubola.svg`), os quatro grupos de galerias (`graphic`, `packaging`, `digital`, `presence`), o vídeo de animação (`animacao-ketchups.mp4`) e os três registros de eventos.
- Peças removidas conforme orientação do Bruno: camiseta, bandana e display de balcão, além das legendas visíveis (`figcaption`) nas galerias de peças.
- `src/pages/ClientCasePage.jsx` e `src/pages/client-case.css` implementam a navegação de capítulos com indicador ativo via `IntersectionObserver`, a ficha técnica no hero, o grid assimétrico de 12 colunas e as transições com GSAP ScrollTrigger.
- Todos os arquivos `.webp` em `public/assets/cases/dubola/` possuem arquivo `.webp.json` correspondente registrando sua origem no acervo local `/Users/bruno/Documents/Dubola Alimentos`.
