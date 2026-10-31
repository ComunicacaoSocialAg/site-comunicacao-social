# Manutenção do case Dubola

O case fica em `/trabalhos/dubola` e apresenta o projeto integrado da Dubola Alimentos com hero cinematográfico de mesa rústica, ficha técnica estruturada (Cliente, Indústria, Categoria e Entregas), narrativa editorial em capítulos numerados, lâminas do catálogo oficial, composições fotográficas de produto, vídeo de motion design e presença em eventos.

## Onde editar

| Arquivo | Responsabilidade |
| --- | --- |
| `src/data/clientCases.js` | Fonte principal de textos, metadados (`meta`, `industry`, `category`), entregas, hero, assinatura, galerias, animação e eventos, no objeto `DUBOLA_CASE`. |
| `src/pages/ClientCasePage.jsx` | Estrutura interativa, ficha técnica do hero, navegação de capítulos com seção ativa, galerias editoriais sem legendas visíveis, vídeos e CTA final. |
| `src/pages/client-case.css` | Layout, tokens CSS, grid editorial de 12 colunas e responsividade da superfície Dubola. |
| `src/entry-prerender.jsx` e `prerender.js` | HTML inicial gerado a partir do próprio componente React. |
| `src/data/projects.js` | Registro `dubola` no portfólio, associado a `DUBOLA_CASE`. |
| `src/components/cinematic/works.js` | Chamada do case na home, utilizando `/assets/cases/dubola/hero-mesa.webp`. |
| `.impeccable/surfaces/case-dubola.md` | Contrato visual, evidências e limites da implementação. |

## Imagens e proveniência

Os arquivos para a web ficam em `public/assets/cases/dubola/` em formato `.webp`, acompanhados de seus arquivos `.webp.json` de proveniência apontando para `/Users/bruno/Documents/Dubola Alimentos`.

As galerias não exibem `<figcaption>` visível abaixo das peças (conforme definição de direção de arte), mas todos os itens exigem `src`, `width`, `height` e `alt` descritivo para acessibilidade e SEO. O campo `span` controla a diagramação no grid de 12 colunas (`full`, `half`, `half-tall`, `narrow`, `wide-right`, `wide-left`, `narrow-right`).

## Vídeos

- **Animação de produto:** `/assets/cases/dubola/animacao-ketchups.mp4` com poster `/assets/cases/dubola/animacao-poster.webp`.
- **Eventos (`events`):** mantêm `src: null` enquanto os vídeos finais de cada participação (`churrasqueadas-1`, `churrasqueadas-2`, `bicho-de-pe`) não forem adicionados.

## Verificação após alterações

Execute `npm run lint`, `npm test`, `npm run build` e `npm run check:seo`.
