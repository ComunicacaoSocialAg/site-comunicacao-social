# Registro documental da extensão Dubola

30 de outubro de 2026. Escopo: case dentro do mundo existente da CS Ag. Não constitui um novo sistema visual.

## Contrato e implementação

O contrato `.impeccable/surfaces/dubola-showcase.md` passou a apontar `src/pages/DubolaShowcasePage.jsx`, `src/pages/dubola-showcase.css` e `src/data/dubolaShowcase.js`. A entrada existente permanece em `ClientCasePage.jsx`, que reexporta `DubolaCasePage.jsx`, que reexporta a implementação. Rota: `/trabalhos/dubola`.

A direção corrigida por Bruno substitui a história editorial anterior: `reel 2.mp4` fornecido em tela cheia, tipografia Syne monumental e exposição multidisciplinar conduzida pela rolagem. Não há antes/depois, cartões, molduras de arte ou legendas visíveis. A identificação de mockups permanece nos textos alternativos. Os contratos anteriores `case-dubola.md` e `dubola-story.md` foram preservados como histórico.

## Correspondência com o mundo existente

Foram comparados `PRODUCT.md`, `DESIGN.md`, `src/index.css`, `src/components/cinematic/cinematic.css` e os arquivos reais da extensão.

| Elemento | Sistema existente e case |
| --- | --- |
| Palco | `#070709` |
| Texto principal | `#f5f5f7` |
| Assinatura, ação e foco | `#f7d406` |
| Títulos | `--font-display`, Syne; case com peso 800 e tracking `-.04em` |
| Leitura | `--font-body`, Plus Jakarta Sans e fallbacks existentes |
| Composição | Palco contínuo, peças protagonistas, recorte e perspectiva |

A extensão corresponde ao sistema incumbente. O título da hero usa `13.1vw`; a escala monumental é autorizada pelo brief. O gutter local `clamp(22px,4.2vw,80px)` conserva o eixo fluido de `4.2vw` da home. Não foram criados tokens globais.

As sete cenas são embalagens, avental, saco de papel, pano de prato, windbanner, landing e campanha. GSAP controla transformações, opacidade e máscaras. O palco sticky usa percurso de `570svh` no desktop e `490svh` em até 700px. Embalagens têm composição móvel própria e ancoragem percentual única. O movimento pode ser desligado; as sete cenas voltam ao fluxo e os vídeos mantêm reprodução manual. A campanha oferece controles nativos quando `motion=false`. Interseção e visibilidade da aba pausam os vídeos. O cabeçalho tem proteção escura de contraste, o link de volta mantém nome acessível e o crédito fica no rodapé.

## Evidência conferida

- Lidos `AGENTS.md`, `PRODUCT.md`, `DESIGN.md`, a referência `impeccable/reference/document.md`, o contrato, os três arquivos de implementação, os dois wrappers, `finish-review.md`, `verdict-1.md` e `evidence.json`.
- Na revisão inicial, os caminhos de mídia foram conferidos. Na versão vigente, desktop e mobile usam o mesmo `/assets/cases/dubola/showcase/reel-2.mp4`, remuxado com faststart sem recompressão, duração de 9,4 s e enquadramento responsivo `object-fit: cover`. O pôster comum é `reel-2-poster.webp`, extraído em 1,2 s. A campanha permanece cópia binária da fonte preexistente, confirmada por SHA-256 na revisão inicial.
- Na revisão inicial, os 21 arquivos de captura foram decodificados. Dimensões: 1440 × 900, 390 × 844, 360 × 800 e 1042 × 972. Inspeção visual documental daquela versão: hero desktop, embalagens mobile, campanha estática mobile e contato em 360px. A evidência vigente das três alterações aprovadas está nas nove capturas de `.impeccable/review/dubola-refinement/evidence.json`, examinadas pelo revisor independente.
- Os 292 hashes de `/tmp/dubola-protected-files.json` foram reconferidos: zero alterações e zero ausências. São 146 arquivos neste projeto e 146 em `../site-novo`.

O parecer anterior, `verdict-1.md`, registra as cinco correções como resolvidas: embalagens, contraste do cabeçalho, reprodução manual da campanha, crédito no rodapé e nome acessível da volta. O parecer mais recente, `.impeccable/review/dubola-refinement/finish-review.md`, emite `ship` para as três alterações aprovadas, sem correções materiais. Seu alcance é restrito ao refinamento, não a uma nova auditoria de toda a superfície.

O manifesto informa build aprovado com 22 rotas, lint de escopo aprovado, SEO aprovado com 277 referências e sete testes existentes aprovados. Os testes pertencem ao controlador da home, não cobrem os componentes novos. Há falhas anteriores de lint global fora do escopo. Esses comandos, o detector e a navegação interativa não foram reexecutados na etapa documental.

## Changelog da aprovação, 30 de outubro de 2026

- Sacola substituída pela imagem exata de `Sacola Papel/sacola papel.png`, branca, com tomates e dois QR codes. Asset vigente: `/assets/cases/dubola/showcase/sacola-papel.webp`.
- Hero substituída por `reel 2.mp4`, com o mesmo vídeo e pôster em desktop e mobile. A adaptação anterior de painel ativo foi removida.
- Texto inserido após “Sua marca. Por inteiro.” e antes de “Vamos amplificar”: “Estratégia, branding, design, comunicação e experiência. Tudo em sintonia para amplificar a sua marca.”
- Contrato, JSX, CSS, dados e novo parecer conferidos nesta atualização documental. Build, lint de escopo, SEO e sete testes existentes foram informados como aprovados após o refinamento. Somente este registro foi editado nesta etapa; direção aprovada e home preservadas.

## Variações e limites registrados sem reparo

O case usa `--dbx-muted: #b7b7bd`, diferente do `#a6a6a9` da home cinematográfica. Os vermelhos `#9f2121` e `#a02121` são locais às peças Dubola. O grafite `#1d1d1b` citado no contrato pertence ao mundo da home, mas não é usado como token pelo CSS novo. Essas variações não foram promovidas ao sistema global.

As capturas têm extensão `.png` e conteúdo JPEG, decodificado com sucesso. Não foram renomeadas. Não houve teste em celular físico, laboratório de performance nem cobertura automatizada específica dos componentes novos. Não se afirma Core Web Vitals medido.

Foram escritos somente este registro e os destinos do contrato vigente. `PRODUCT.md`, `DESIGN.md`, a ausência de `.impeccable/design.json`, contratos anteriores, implementação, assets e home permaneceram preservados. Nenhuma correção de contexto global, skill, copy ou código foi realizada. Sem espelhamento adicional nesta etapa, geração paga ou publicação.
