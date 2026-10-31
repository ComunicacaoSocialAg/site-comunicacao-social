# Dubola: da embalagem à brasa

Modo: Experience e Persuade. Primeiro case completo de cliente, em /trabalhos/dubola. A estrutura é uma extensão do layout escolhido pelo usuário: /trabalhos/gastronomia. Manter a home, as páginas institucionais e os demais cases.

## Direction contract

THESIS: mostrar um trabalho integrado, da marca e da embalagem à presença digital e aos eventos. O portfólio demonstra entregas, sem resultados comerciais inventados.

OWN-WORLD: herdar a navegação, hero cinematográfico, fundo preto, tipografia e leitura editorial do case Gastronomia. Os produtos reais, a assinatura bordô e os rótulos amarelos da Dubola dão identidade às pranchas de apresentação.

STORY: reconhecer a marca, entender o desafio de coerência entre meios, explorar branding, embalagens, catálogo, landing page, fotografia, animações e materiais de eventos. Encerrar com uma conversa sobre um projeto.

FIRST VIEWPORT: hero de tela inteira, Dubola e “Da embalagem à brasa.” na base esquerda, uma composição fornecida com três embalagens de ketchup à direita, retorno e contato no topo. No mobile, produtos acima e título abaixo. Preservar o quadro e a leitura dos rótulos.

FORM: direção especificada pelo usuário, sem sorteio de conceito. Construção direta dentro do layout existente. Assinatura de movimento: os produtos da abertura recuam suavemente com a rolagem; capítulos, imagens e texto seguem em fluxo nativo. Movimento reduzido mantém tudo estático.

FINISH: encerrar a extensão com revisão, limites explícitos e documentação desta superfície. Preservar o sistema global existente e registrar a proveniência de cada imagem utilizada.

Evidência: escopo confirmado pelo usuário. A fonte principal da implementação atual é a pasta fornecida `/Users/bruno/Documents/Dubola Alimentos`, com composições de produto, conceitos gráficos, aplicações em mockup, catálogo, logo SVG e animação de produto. `dubola.key` permanece preservado como fonte anterior; suas páginas de proposta e relatórios internos não entram no site. Três espaços de vídeo explicitamente solicitados: duas participações no Churrasqueadas, Campinas, e Bicho de Pé BBQ, Rafard. Sem datas, métricas ou depoimentos presumidos.

## Evidência de implementação

A extensão foi comparada por código com `src/components/ProjectPage.jsx`, a entrada `gastronomia` em `src/data/projects.js`, as fontes de `src/index.css` e a direção existente em `DESIGN.md` e `PRODUCT.md`. A composição preserva o hero amplo, o palco escuro, as fontes Syne e Plus Jakarta Sans, a navegação de retorno e a leitura editorial. As pranchas bordô e amarelas, o sistema de embalagens e a assinatura “Como deve ser” identificam a Dubola dentro desse repertório.

- `src/pages/ClientCasePage.jsx` e `src/pages/client-case.css` implementam a superfície específica, com estilos locais ao case, capítulos em fluxo, imagens grandes e galerias que passam de duas colunas a uma no mobile.
- `src/data/clientCases.js` reúne narrativa, entregas confirmadas, hero, assinatura, quatro grupos de galerias, animação de produto e três registros de eventos. `src/data/clientCaseHtml.js` gera o HTML inicial a partir desses mesmos dados.
- `src/data/projects.js` associa o case ao projeto `dubola`. `ProjectPage` encaminha projetos com `caseStudy` ao novo componente. `App.jsx` adapta o entorno da rota. `src/components/cinematic/works.js` e `CinematicHome` permitem abrir o case a partir da home.
- A apresentação usa 17 imagens WebP: uma no hero, uma assinatura e 15 distribuídas entre conceitos gráficos, embalagens, catálogo e presença. Há ainda um poster WebP para a animação e o logo SVG copiado do acervo.
- Os objetos de hero, assinatura e galerias fornecem `src`, `width`, `height` e `alt` aos dois renderers. As galerias também compartilham `caption`, `wide` e `surface`. O logo tem dimensões literais de 929 × 650 nos dois renderers. O título principal tem teto de 6rem; o cabeçalho estático usa as mesmas classes da versão interativa.
- O movimento dos produtos fica restrito à abertura e à rolagem do hero, condicionado a `prefers-reduced-motion: no-preference`. A navegação tem foco visível. A animação digital de produto é um MP4 H.264 de cinco segundos, com reprodução manual, separado dos registros de eventos. O player usa controles nativos, não inicia reprodução automática e, na versão interativa, pausa fora da tela ou ao ocultar a aba.

Esta documentação encerra somente a extensão do case. `DESIGN.md` e `PRODUCT.md` foram preservados. `.impeccable/design.json` não foi encontrado nesta leitura e não foi criado. Não há migração nem redefinição do sistema visual global.

## Acervo e limites

As imagens atuais derivam dos originais locais fornecidos em `Dubola Alimentos`. As galerias mostram ketchups, maioneses, mostarda Dijon, molhos de tomate, conceitos gráficos, catálogo e aplicações de avental, camiseta, bandana, pano de prato, windbanners, sacola e display. Os mockups apresentam o design das aplicações; não constituem registro fotográfico de produção ou de uso em evento. A animação deriva de `trio ketchup dubola hero.mp4`; seu poster foi extraído do quadro em dois segundos.

O passe de implementação registrou a proveniência com o CLI `embed-prompt`. A verificação `embed-prompt --scan public/assets/cases/dubola` retornou `SCAN: 23 rasters, 0 missing`: 17 imagens WebP, um poster WebP e cinco PNGs anteriores. Os cinco PNGs recuperados de `dubola.key` foram mantidos, mas não são usados na apresentação atual.

As entregas estão confirmadas pelo usuário. A página ainda não mostra captura da landing page nem registros audiovisuais identificados das três participações em eventos. Os três eventos têm `src: null` e `poster: null`; o estado visível é “Vídeo em breve”. A animação de produto não preenche esses espaços. Não foram inventados registros, URLs, datas ou resultados. O projeto mantém `year: ''` e `results: []`.

A revisão descrita acima é de código e dos dados de origem. A inspeção visual da página em navegador local, em desktop e mobile, permanece pendente por indisponibilidade do navegador nesta etapa. O documento não atesta enquadramento final, contraste medido, ausência de rolagem horizontal, desempenho ou reprodução no navegador. Nenhuma publicação foi autorizada ou realizada.

Manutenção: `docs/cases/dubola.md` descreve os pontos de edição, a troca das imagens e o preenchimento dos vídeos.
