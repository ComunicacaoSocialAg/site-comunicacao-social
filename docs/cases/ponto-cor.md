# Ponto Cor: a vontade de criar

Rota: `/trabalhos/ponto-cor`.

## Escopo confirmado

Bruno informou gestão da presença digital, com destaque para Carnaval e lançamentos. O reel fornecido por Bruno em `Ponto cor/reels ponto cor.mp4` está no hero. Não há métricas de negócio ou depoimentos fornecidos para sustentar alegações de resultado.

## Curadoria e apresentação

Foram examinadas as miniaturas de 434 imagens de Instagram e logos, dentro de um acervo com 692 imagens. A versão utiliza 25 imagens de campanhas e duas versões originais do logo, em WebP, com a origem de cada arquivo registrada e embutida no próprio raster.

- Abertura com reel Ponto Cor em largura integral, tipografia e assinatura CS Ag + Ponto Cor sobrepostas. No celular, o quadro completo do reel é preservado.
- Carnaval: ombreiras, miçangas, headpieces, brincos, customização de abadás e acessórios. Passarela ligada à rolagem no desktop e galeria por gesto no mobile.
- Campanha de cores e sabores: Mirtilo, Chocolate, Azeite, Capim-limão e Pitaya, em transições de recorte ligadas ao scroll.
- Lançamentos de inverno: capa com novelos suspensos e quatro variações cromáticas.
- Continuidade editorial: bordado, buquê de crochê, bolsa, manta, cores e Dia das Mulheres.
- Fecho com CTA para o WhatsApp da agência e link para outros trabalhos.

## Continuidade visual e movimento

Extensão da família aprovada dos cases: Syne nos títulos, Plus Jakarta Sans na leitura, assinatura compartilhada, foco amarelo e palco com rolagem própria. Os neutros locais #101010 e #f7f5ef e os campos de cor das campanhas ficam restritos ao case. Nenhuma mudança no sistema global.

O momento central é a passarela de seis artes de Carnaval ligada à rolagem no desktop. A abertura aproxima discretamente o vídeo no desktop e usa recorte tipográfico; cinco cenas de cores se sucedem por máscaras verticais. A capa de inverno recebe movimento discreto apenas no desktop. Até 760 px, a passarela usa rolagem horizontal nativa por gesto ou teclado e as cenas de cores recebem composição própria. Pausa explícita e prefers-reduced-motion devolvem as cenas ao fluxo normal, mantendo todas as peças disponíveis.

A assinatura da abertura combina CS Ag e a versão branca vertical original da Ponto Cor. O fecho usa a versão colorida horizontal original. Logos transparentes, sem redesenho ou recoloração; tratamento limitado ao corte de margem transparente, redimensionamento e WebP.

## Arquivos

Implementação em `src/pages/PontoCorShowcasePage.jsx`, `src/pages/ponto-cor-showcase.css` e `src/data/pontoCorShowcase.js`. Assets em `public/assets/cases/ponto-cor/`. Fontes e hashes no `provenance.json`. O contrato de direção está em `.impeccable/surfaces/src-pages-pontocorshowcasepage-jsx.md`.

Integrações em ClientCasePage, catálogo de projetos, seleção da home e lista de cases verificados do SEO. HTML estático, metadados, schema e sitemap são gerados pelo pipeline existente.

A prévia na porta 4173 serve a cópia `CSAg-Site-Completo-2026-10-28`. As mudanças e o build foram sincronizados com essa cópia, mantendo `site-novo` como fonte versionada. Sem publicação em produção.

## Validação

Build e checagem SEO aprovados: 25 páginas, 9 URLs indexáveis e 405 referências de recursos. Os sete testes existentes passaram. Lint dos seis arquivos JavaScript/JSX afetados aprovado. O lint global já contém erros fora do escopo deste case. O projeto não dispõe de comando de checagem TypeScript.

Revisão visual segmentada em desktop e mobile, com navegação, pausa e origem dos assets verificadas. Não houve ensaio em celular físico nem medição de Core Web Vitals.

A revisão independente pediu dois ajustes, presentes no código final: nomes de cores sem quebra no mobile, incluindo Mirtilo, e nome acessível Voltar ao início no retorno.

Revisão independente concluída: `ship` no passe dos dois ajustes, ambos resolvidos. Confirmados nomes completos em 360 e 390 px e nome acessível do retorno. Pausa verificada no navegador: as cinco cenas voltam ao fluxo estático sem recortes.

## Reel no hero

Reel original de 35,7 s e 1280 × 720 px, sem cortes na montagem. Conversão de HEVC para H.264/yuv420p com faststart, de 32,4 MB para 12,1 MB. A faixa de áudio original foi medida em -91 dB em toda a duração, portanto a versão web não inclui áudio. Poster obtido do próprio reel em 0,5 s.

Reprodução automática muda em loop, pausa dedicada, pausa fora da tela ou da aba e integração com Pausar animações. Com movimento reduzido, o poster permanece e a reprodução exige ação. Mobile usa contain para manter os três painéis visíveis. Falha de carregamento mostra poster e link para o arquivo. Build, SEO e lint do JSX aprovados; pausa, retomada, pausa fora do hero e pausa geral verificadas no navegador.

Revisão independente do hero com reel: `ship`, sem achados materiais no escopo da substituição. Capturas em 1280 × 720 e 390 × 844.
