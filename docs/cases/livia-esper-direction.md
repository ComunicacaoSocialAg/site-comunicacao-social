# Direção da superfície: Dra. Lívia Esper

Direção definida: **O afeto tem um universo inteiro.** Modo Experience. Este documento registra a expressão do case implementada em `src/pages/LiviaEsperShowcasePage.jsx` e `src/pages/livia-esper-showcase.css`. Não define uma nova identidade para a Comunicação Social Ag.

## Overview

O filme do Dentinho abre o case. A sequência conecta logotipo, materiais, identidade em movimento, site, SaaS e presença digital. O elemento memorável é a câmera de rolagem atravessando capturas reais do site da cliente em três cenas.

O palco preto, o branco de leitura, Syne e Plus Jakarta Sans prolongam o mundo existente da agência. A paleta pastel, os balões em formato de dentes, o Dentinho e os materiais reais pertencem à cliente. Os fundos claros da identidade e do SaaS são decisões desta superfície. Não substituem o palco ou os tokens globais de `DESIGN.md`.

## Colors

Os tokens abaixo estão declarados no escopo local do case. A fonte implementada é o CSS da página; esta tabela não promove os valores a tokens globais.

| Token local | Valor implementado | Uso |
| --- | --- | --- |
| `--le-black` | `#070709` | Palco, cabeçalho e base dos filmes |
| `--le-white` | `#f5f5f7` | Texto sobre palco escuro e controles de vídeo |
| `--le-muted` | `#b6b4bd` | Texto secundário e capítulos inativos |
| `--le-pink` | `#dfa1bf` | Faixa de cor, capítulo ativo e encerramento |
| `--le-blue` | `#abd6df` | Faixa da identidade |
| `--le-yellow` | `#f2df62` | Faixa da identidade e foco visível |
| `--le-ink` | `#29232c` | Leitura nas superfícies claras e no encerramento |

Os acentos legados do arquivo de dados não são a paleta CSS desta página. A apresentação do logotipo usa o arquivo original, sem redesenho.

## Typography

Títulos usam `var(--font-display, 'Syne', sans-serif)`; leitura usa `var(--font-body, 'Plus Jakarta Sans', sans-serif)`. A página conserva as famílias existentes.

O token local de títulos de seção é `--le-heading: clamp(38px, 5.5vw, 88px)`, com entrelinha `1.04`. Títulos usam peso `700` e espaçamento `-.035em`. O hero usa peso `800`, entrelinha `1.03` e escala `clamp(44px, 5vw, 92px)`; no mobile, `clamp(40px, 10vw, 65px)`. A leitura usa `clamp(15px, 1.3vw, 19px)` e entrelinha `1.75`.

## Layout

| Token local | Valor implementado | Uso |
| --- | --- | --- |
| `--le-gutter` | `clamp(22px, 5vw, 90px)` | Margens laterais principais |
| `--le-space` | `clamp(80px, 11vw, 180px)` | Respiro entre grandes blocos |
| `--le-gap` | `clamp(18px, 3vw, 48px)` | Intervalos de composições e reels |

O case ocupa uma camada fixa com rolagem própria. O cabeçalho sticky mede `68px`, passando a `60px` até `760px`. Identidade e SaaS têm blocos próprios, separados da apresentação do site. A papelaria aparece uma única vez. A galeria social usa uma faixa horizontal menor com as mesmas seis peças, sem legendas visíveis; os textos alternativos identificam as peças.

Acima de `760px`, com movimento habilitado, o site ocupa um percurso de `470svh`, com palco sticky e três cenas sobrepostas. Até `760px`, ou com movimento desligado, as três cenas permanecem no fluxo normal. A partir de `1600px`, a captura de abertura reduz a largura de `90%` para `80%` do palco.

## Elevation & Depth

Perspectiva de `1500px`, rotação e sobreposição dão profundidade às capturas do site. O token local `--le-shadow: 0 35px 85px #0005` acompanha essas telas. O painel do SaaS usa uma sombra própria e mais discreta (`0 25px 70px #3a1c3a1a`). Não há uma coleção de cartões de serviços com a mesma sombra.

## Shapes

O palco e as grandes áreas são contínuos. Capturas de desktop e painel do SaaS têm cantos de `6px`. A composição de celular tem borda e cantos de `24px`, reduzidos a `16px` no mobile. Controles de filme usam cantos de `4px`. Esses valores descrevem elementos existentes, sem instituir uma escala global de raios.

## Components

**Filme de abertura.** O hero usa o trecho final informado de `18,07s` e `2,78 MB`, derivado do filme original e sem áudio. O escurecimento é um pseudo-elemento do próprio componente Film, com `z-index: 1`. O controle fica acima dele no mesmo contexto, com `z-index: 12` no hero. O botão mantém branco de leitura sobre fundo `#070709d9`; no mobile, o controle vai para a base e o texto do hero sobe para reservar espaço.

**Filmes de marca e reels.** Todos têm pôster, reprodução inline, loop, carregamento `preload="none"` e pausa manual. Só os filmes com opção de som exibem o controle de áudio; iniciam silenciados. A reprodução automática depende de movimento habilitado, visibilidade e ausência de pausa manual. Ao sair da área observada ou ocultar a aba, o vídeo pausa. Uma falha de mídia oferece link para abrir o arquivo. Com movimento desligado, o visitante ainda pode iniciar um filme manualmente.

**Palco do site.** As cenas são abertura, aventura/afeto e composição desktop/celular. GSAP ScrollTrigger usa `scrub: 0.85`, transforma capturas e faz a passagem entre cenas. A navegação marca o capítulo atual e desloca a rolagem para ele. Não há captura de roda. A entrada do título (`1.25s`, intervalo `0.09s`, `expo.out`) e o deslocamento do hero (`scrub: 0.8`) também dependem de movimento habilitado; podem ocorrer no mobile, embora o palco de três cenas fique em fluxo normal.

**Movimento reduzido.** A preferência do sistema inicializa o estado e acompanha mudanças. Com movimento desligado, a montagem GSAP não é aplicada, os filmes não iniciam automaticamente e os saltos internos são imediatos. O CSS desliga animações e transições quando `prefers-reduced-motion: reduce`. O cabeçalho também permite desligar ou ativar o movimento. Todas as capturas continuam no documento.

**Navegação e leitura.** Há salto para depois da abertura, retorno aos trabalhos, contato, foco visível em links e botões e foco programático nos destinos internos. Esses fatos são observáveis no código; não equivalem a uma auditoria de acessibilidade em navegador.

## Do's and Don'ts

- **Do** manter o logotipo original íntegro, o Dentinho e as capturas reais como evidência do projeto.
- **Do** preservar identidade, site, SaaS e presença digital como partes distintas do mesmo percurso.
- **Do** manter papelaria uma vez, galeria sem legendas e conteúdo completo no fluxo sem montagem cinematográfica.
- **Don't** transformar a paleta pastel ou a composição deste case no sistema global da agência.
- **Don't** acrescentar resultados, promessas clínicas, depoimentos ou afirmações normativas.
- **Don't** descrever testes de renderização ou performance como concluídos com base apenas na leitura do código.

## Evolução da galeria social, 01/11/2026

Direção aprovada pelo Bruno, implementada em `src/components/LiviaSocialGallery.jsx`: posts menores e inteiros, com rotação estática de até `2deg`. Tokens locais: `--le-post-width: clamp(220px, 24vw, 300px)`, `--le-post-gap: clamp(32px, 5vw, 80px)` e `--le-gallery-height: clamp(470px, 68svh, 660px)`. A partir de `761px`, com movimento habilitado, a rolagem vertical desloca horizontalmente uma única faixa, com `scrub: 0.65`. Mobile e movimento desligado usam overflow horizontal nativo; no mobile, a largura é `min(68vw, 260px)` e o intervalo é `28px`. A preferência reduzida remove também a rotação estática. Sem novos assets ou alteração da copy editorial.

Setas de `44px` e teclado percorrem as peças. Clique abre diálogo nativo com imagem inteira e fechamento de `44px`. Escape fecha apenas a imagem; o foco retorna ao botão que a abriu, com `preventScroll` e proteção de `restoringFocusRef` contra reposicionamento da faixa. A confirmação funcional pelo coordenador mostrou que Esc e o botão de fechar preservam a posição da galeria; Esc também devolve o foco à peça. O reviewer independente encerrou o ajuste com veredito `ship`. A revisão visual reportada mostra três peças inteiras em `1440px` e duas inteiras mais partes das adjacentes em `1042px`.
