---
version: 1
slug: "src-pages-pontocorshowcasepage-jsx"
primary_target: "src/pages/PontoCorShowcasePage.jsx"
related_targets: ["src/pages/ponto-cor-showcase.css","src/data/pontoCorShowcase.js"]
---

# Ponto Cor: a vontade de criar

Mode: Experience. Rota: /trabalhos/ponto-cor. Público: potenciais clientes da CS Ag. Ação: explorar o trabalho e conversar com a agência. Provas: peças fornecidas por Bruno no acervo Ponto Cor. Escopo confirmado: gestão da presença digital. Carnaval e lançamentos protagonizam. Sem dados de performance, reel fornecido para a abertura ou alegações sobre fabricação de produtos.

## Direction contract

THESIS: Transformar a diversidade criativa da Ponto Cor numa exposição de campanhas. O trabalho ocupa o palco, sem caixas com legendas ou imitação de feed.
OWN-WORLD: A gramática do palco escuro é herdada da agência. Os neutros locais são preto #101010 e branco #f7f5ef, com campos laranja #d65e18, vinho #6b173a, azul #262347 e verde #39442b extraídos das peças. Syne em títulos e Plus Jakarta Sans na leitura preservam a família dos cases; amarelo #f7d406 mantém foco e seleção reconhecíveis. São escolhas desta superfície, não novos tokens globais.
STORY: Primeiro o impacto do Carnaval, depois o papel da presença digital, a variedade da campanha, a cor como linguagem nos lançamentos e a conexão com o universo manual. Fecho com contato.
FIRST VIEWPORT: Reel original da Ponto Cor ocupa o hero em largura integral, com nome PONTO COR monumental, assinatura CS Ag + logo branco original acima e controle de pausa no canto superior direito. Explore o case na base direita. O scroll aproxima discretamente o vídeo e retira a tipografia. Mobile preserva o quadro completo do reel com contain e mantém nome e logos legíveis.
FORM: Extensão do mundo existente com direção já determinada pelo briefing e cases aprovados; implementação direta com acervo real, sem geração de imagens. Momento central: passarela horizontal de peças completas de Carnaval; depois uma troca por recortes verticais de cinco campanhas de novelos e sabores. Pausa e movimento reduzido restituem leitura estática integral.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Cumprimento: extensão ordinária comparada com DESIGN.md existente, sem reescrita global. Revisão independente e documentação do case registradas em docs/cases/ponto-cor.md; proveniência dos rasters em public/assets/cases/ponto-cor/provenance.json.

## Implementação final

O momento central é a passarela de Carnaval: seis artes completas em trilho horizontal vinculado à rolagem no desktop. A abertura usa recorte tipográfico e aproximação do reel; a série de cinco cores segue por máscaras verticais. A capa de inverno recebe deslocamento e rotação discretos apenas no desktop. GSAP ScrollTrigger opera no contêiner do próprio case, sem nova dependência ou WebGL.

Até 760 px, Carnaval vira galeria horizontal por gesto ou teclado, sem travar a rolagem vertical. As cinco cores conservam a montagem com composição móvel própria. O controle Pausar animações e prefers-reduced-motion removem a classe de montagem e os estilos GSAP: todas as peças permanecem acessíveis, as cores entram em fluxo normal e Carnaval fica sob rolagem horizontal nativa. O retorno preserva o nome acessível Voltar ao início; os nomes das cores não quebram no mobile.

Logo branco original vertical (logo-white.webp) na assinatura compartilhada CS Ag + Ponto Cor da abertura; logo colorido horizontal (logo-color.webp) isolado no fecho. Ambos têm fundo transparente, proporção preservada e somente corte da margem transparente, redimensionamento e conversão WebP. Não foram redesenhados nem recoloridos.

O reel da marca, as peças completas, os novelos associados a sabores e as variações originais do logo identificam o cliente. A cor e o movimento servem à curadoria do trabalho, sem métricas ou alegações de resultado.

## Limites
Nenhuma publicação em produção nesta etapa. Seleção visual e conteúdo do case autorizados pelo pedido. Não alterar copy das outras páginas. A família visual já está em DESIGN.md; esta superfície não a substitui.

Reel: `hero-reel.mp4`, H.264 1280 × 720, 35,7 s, loop mudo. Pausa dedicada, visibilidade do contêiner/aba e controle geral gerenciam a reprodução; movimento reduzido mantém poster sem autoplay. `hero-reel-poster.webp` deriva do original em 0,5 s. Sem mudanças nas seções abaixo da abertura.
