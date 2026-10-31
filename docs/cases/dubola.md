# Manutenção do case Dubola

O case fica em `/trabalhos/dubola` e segue a direção escolhida pelo usuário a partir de `/trabalhos/gastronomia`: hero cinematográfico, corpo editorial, imagens grandes e áreas de vídeo. A extensão usa o sistema existente. Mudanças neste case não exigem reescrever `DESIGN.md`, `PRODUCT.md` ou a identidade do site.

## Onde editar

| Arquivo | Responsabilidade |
| --- | --- |
| `src/data/clientCases.js` | Fonte principal de textos, entregas, hero, assinatura, galerias, animação e eventos, no objeto `DUBOLA_CASE`. |
| `src/pages/ClientCasePage.jsx` | Estrutura interativa, capítulos, imagens, vídeos e contato. |
| `src/pages/client-case.css` | Layout e estilos da superfície Dubola. |
| `src/entry-prerender.jsx` e `prerender.js` | HTML inicial gerado a partir do próprio componente React. |
| `src/data/projects.js` | Registro `dubola` no portfólio, associado a `DUBOLA_CASE`. |
| `src/components/cinematic/works.js` | Chamada do case na home, incluindo imagem, título e resumo próprios. |
| `.impeccable/surfaces/case-dubola.md` | Contrato visual, evidências e limites da implementação. |

Edite o conteúdo no objeto `DUBOLA_CASE` para manter a página interativa e o HTML inicial alinhados. Preserve os IDs dos capítulos e eventos, usados nas âncoras. A pré-renderização agora usa o próprio componente React. Não manter uma segunda versão manual da copy em `clientCaseHtml.js`, preservado apenas como arquivo legado.

A chamada da home tem textos e caminho de imagem em `works.js`. Atualize essa entrada quando a mudança também deva aparecer na home. O registro de projeto deriva sua imagem de `DUBOLA_CASE.images.ketchup`.

## Fonte e imagens atuais

A fonte principal é o acervo local fornecido em `/Users/bruno/Documents/Dubola Alimentos`. Os arquivos para a web ficam em `public/assets/cases/dubola/`; nos dados, o caminho começa por `/assets/cases/dubola/`, sem `public`. Preserve os originais de produção.

A apresentação contém 17 imagens WebP: hero e assinatura, mais 15 imagens de galerias. Um poster WebP adicional acompanha a animação de produto. O logo foi copiado como SVG.

| Objeto em `DUBOLA_CASE` | Conteúdo e arquivos atuais |
| --- | --- |
| `hero` | Trio de ketchups em `ketchups.webp`. |
| `signature` | Assinatura “Como deve ser” em `como-deve-ser.webp`. |
| `images.logo` | Logo em `logo-dubola.svg`. |
| `galleries.graphic` | `conceito-goiaba.webp` e `lamina.webp`. |
| `galleries.packaging` | `ketchups-ingredientes.webp`, `maioneses.webp`, `mostarda-dijon.webp` e `molhos-tomate.webp`. |
| `galleries.digital` | Mockup de catálogo em `catalogo.webp`. |
| `galleries.presence` | `avental.webp`, `camisetas.webp`, `bandana.webp`, `pano-prato.webp`, `windbanner-frente-verso.webp`, `windbanner-goiaba.webp`, `sacola.webp` e `display.webp`. |

Os mockups são materiais fornecidos que apresentam o design das aplicações. Preserve essa distinção nas legendas e no texto alternativo; eles não comprovam produção física ou uso em um evento. A página ainda não apresenta captura da landing page nem registros audiovisuais identificados dos eventos.

Os cinco PNGs anteriores, recuperados de `dubola.key`, continuam na pasta, mas não aparecem na apresentação atual. As chaves legadas `images.tomato`, `images.basil` e `images.tomatoes` também não são usadas pelos renderers atuais. Não as confunda com os objetos das galerias.

## Trocar ou acrescentar imagens

1. Use uma peça fornecida ou aprovada para o case. Registre o caminho original e a transformação aplicada com o CLI `embed-prompt`, conforme a convenção do projeto. O scan desta implementação retornou `SCAN: 23 rasters, 0 missing`, incluindo os cinco PNGs anteriores.
2. Prepare uma versão para a web, salve na pasta pública e atualize `src`, `width`, `height` e `alt` no objeto correspondente em `hero`, `signature` ou `galleries`. Informe as dimensões reais do arquivo otimizado.
3. Para galerias, preencha também `caption`. Use `wide: true` quando a imagem deva ocupar as duas colunas no desktop. `surface` aceita os tratamentos implementados `white`, `wine`, `gold` e `ink`; sua ausência usa o fundo padrão. Esses campos são compartilhados por React e pelo HTML inicial.
4. As dimensões e o texto alternativo de hero, assinatura e galerias derivam dos dados nos dois renderers. A exceção é o logo: se mudar `images.logo` para uma arte com outra proporção, ajuste também os valores literais de 929 × 650 em `ClientCasePage.jsx` e `clientCaseHtml.js`.
5. Ao trocar o trio de ketchups, confira três referências: `hero.src`, `images.ketchup`, usado pelo registro do projeto, e `image` da entrada Dubola em `works.js`, usada na home.
6. Revise desktop e mobile para preservar os quadros, as legendas e a leitura dos rótulos. O CSS usa enquadramento próprio para o hero e `object-fit: contain` nas imagens de galeria com proporção definida.

## Animação digital de produto

O objeto `DUBOLA_CASE.motion` controla título, arquivo, poster e legenda da animação de ketchups:

| Campo | Valor atual |
| --- | --- |
| `src` | `/assets/cases/dubola/animacao-ketchups.mp4` |
| `poster` | `/assets/cases/dubola/animacao-poster.webp` |
| `title` | “A identidade ganha movimento.” |
| `caption` | “Animação digital de produto. Linha de ketchups Dubola.” |

O vídeo para a web é um MP4 H.264 de cinco segundos derivado do original `trio ketchup dubola hero.mp4`, no acervo fornecido. O poster vem do quadro em dois segundos. Para substituir, prepare os arquivos reais, atualize os dois caminhos e revise título e legenda. A reprodução é manual, com controles nativos. Essa animação tem função de apresentação de produto e não deve ser associada aos vídeos dos eventos.

## Preencher os três vídeos de eventos

Cada item de `DUBOLA_CASE.events` tem os campos `src` e `poster`. Ambos começam como `null` até que o arquivo correspondente esteja disponível.

| ID | Conteúdo esperado |
| --- | --- |
| `churrasqueadas-1` | Primeira participação da Dubola no Churrasqueadas, Campinas, SP. |
| `churrasqueadas-2` | Segunda participação da Dubola no Churrasqueadas, Campinas, SP. |
| `bicho-de-pe` | Participação da Dubola no Bicho de Pé BBQ, Rafard, SP. |

Para cada participação:

1. Identifique o vídeo correto antes de associá-lo ao evento. Não deduza datas ou edições a partir do nome do arquivo.
2. Prepare o vídeo e uma capa extraída ou aprovada para esse mesmo conteúdo. A área usa proporção 16:9 e `object-fit: contain`, preservando o quadro completo.
3. Coloque os arquivos em `public/assets/cases/dubola/` e preencha `src` e `poster` com os caminhos públicos reais. Um arquivo público chamado `public/assets/cases/dubola/NOME-REAL.mp4` é referenciado como `/assets/cases/dubola/NOME-REAL.mp4`. Use o nome que de fato existir.
4. Mantenha `src: null` enquanto o vídeo não existir. Uma capa sozinha não substitui esse estado: o componente só cria o player quando há `src`.
5. Ajuste `eventIntroduction` quando os espaços já contiverem vídeos, para retirar a frase que diz que receberão os trechos.

O player compartilhado pela animação e pelos eventos tem controles nativos, `playsInline` e `preload="none"`. Não há autoplay. Na versão interativa, a reprodução pausa quando o vídeo sai da tela ou a aba fica oculta. Se houver erro de carregamento, aparece uma mensagem com link para abrir o arquivo diretamente. Confirme esses comportamentos com os arquivos reais. A página HTML inicial também recebe os campos `src` e `poster`, por isso não é necessário duplicar URLs no renderer.

## Conteúdo e verificação

O usuário confirmou as entregas descritas no case. Não há comprovação de métricas, datas, prêmios, depoimentos ou resultados comerciais. Preserve `year: ''` e `results: []` no projeto até existir evidência para mudá-los. Páginas de proposta e relatórios internos de `dubola.key` não são material público do case.

Depois de uma alteração, rode `npm run lint` e `npm run build`. O build executa também `prerender.js`. Abra a rota com JavaScript e confira o HTML inicial gerado em `dist/trabalhos/dubola/index.html` quando precisar validar a pré-renderização.

Antes de publicar, revise a página a 360px e em desktop: enquadramento dos rótulos e mockups, rolagem horizontal, âncoras, navegação por teclado, movimento reduzido, contato e reprodução da animação de produto. Quando os três vídeos de eventos forem preenchidos, inclua a reprodução deles nessa revisão. A inspeção visual da página em navegador local ainda estava pendente ao escrever esta documentação. Não há aprovação visual ou autorização de publicação registrada aqui.
