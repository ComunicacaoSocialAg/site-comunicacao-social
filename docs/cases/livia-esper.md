# Case Dra. Lívia Esper

Rota registrada: `/trabalhos/livia-esper`. Os identificadores `livia-esper-site` e `livia-esper-sistema` permanecem registrados para compatibilidade.

Escopo confirmado pelo Bruno: branding, logotipo, outros materiais de marca, gestão de presença digital, site do Dentinho e SaaS personalizado. Direção da superfície: [livia-esper-direction.md](livia-esper-direction.md).

## Materiais e percurso

O hero apresenta “Pequenos sorrisos. Um universo inteiro.” sobre o filme do Dentinho. O trecho final informado tem `18,07s`, `2,78 MB` e não contém áudio. A origem é `Documents/Livia Esper/Site/odontopediatra.mp4`; o case usa `public/assets/cases/livia-esper/universo-dentinho.mp4` e seu pôster.

O site oficial confirmado é https://draliviaesper.com.br. As capturas reais em `public/assets/cases/livia-esper/screens/` foram feitas em 31/10/2026: abertura, aventura, afeto, sobre e mobile. A captura antiga de celular, fora de `screens/`, não é usada por esta página. O logotipo original vem da pasta do site da cliente. O manifesto de origem está em `public/assets/cases/livia-esper/provenance.json`.

A ordem implementada é abertura, apresentação do escopo, identidade com logotipo e papelaria uma vez, animação dos balões, site em três cenas, SaaS em área própria, seis peças sociais sem legendas visíveis, reels e contato. A apresentação do SaaS se limita à captura do painel e ao escopo confirmado; não presume funcionalidades adicionais.

Em 01/11/2026, a galeria passou de duas colunas grandes para uma faixa de peças menores: rolagem vertical conduz avanço horizontal no desktop a partir de `761px`, com movimento habilitado; mobile e movimento desligado usam rolagem horizontal nativa. Clique amplia a imagem em diálogo nativo. Escape fecha apenas a imagem e devolve o foco ao botão de origem, sem reposicionar a faixa. Permanecem as mesmas seis peças, sem legendas, novos assets ou alteração da copy editorial.

## Extensão do mundo existente

O palco preto (`#070709`), o branco de leitura (`#f5f5f7`), Syne e Plus Jakarta Sans mantêm a continuidade com `DESIGN.md`. Os tons pastel, o logotipo com balões de dentes, o Dentinho e os materiais reais singularizam a cliente dentro desse palco.

Os tokens `--le-*`, os fundos claros de identidade/SaaS e a câmera que percorre capturas são decisões locais, registradas no documento de direção. Não substituem o amarelo da agência nem a narrativa global do alto-falante. `PRODUCT.md` e `DESIGN.md` foram preservados nesta documentação. Nesta cópia `site-novo`, `.impeccable/design.json` não foi encontrado e não foi criado.

## Movimento e controle

Com movimento habilitado e largura a partir de `761px`, GSAP ScrollTrigger monta as três cenas em palco CSS sticky, com perspectiva, sobreposição e composição desktop/celular. O percurso tem `470svh` e `scrub: 0.85`, sem captura de roda. A navegação de capítulos acompanha o progresso e permite saltar entre cenas.

No mobile, as três cenas seguem no fluxo normal. O título e o hero ainda podem animar quando o movimento está habilitado. Com movimento desligado, a montagem GSAP inteira é removida e todos os conteúdos continuam acessíveis no fluxo. A preferência `prefers-reduced-motion` é observada; o cabeçalho também oferece controle de movimento. O CSS desliga animações e transições para a preferência reduzida.

Vídeos iniciam mudos, respeitam pausa manual e pausam fora da área visível ou com a aba oculta. Com movimento desligado, não iniciam automaticamente, mas podem ser reproduzidos manualmente. O hero não oferece botão de som, pois o arquivo não contém áudio. Filme de identidade e reels oferecem esse controle. Há pôster e link de recuperação em falha de mídia.

O escurecimento do hero pertence ao pseudo-elemento do próprio Film. O controle fica acima dele no mesmo contexto de empilhamento. A revisão independente reportada pelo coordenador apontou apenas o contraste desse controle no mobile, já corrigido com texto branco sobre fundo escuro explícito. Esta passagem documental confirmou a regra no CSS, sem repetir a verificação visual.

## Teste de diferenciação

Avaliação estrutural pela leitura dos materiais, JSX e CSS:

| Pergunta | Elemento concreto e conclusão |
| --- | --- |
| Poderia pertencer a um concorrente com a simples troca do nome? | O filme do Dentinho, as cinco capturas do site oficial, a papelaria e o painel real são específicos desta cliente. A troca do nome deixaria essas evidências incompatíveis. |
| Sem o logotipo, ainda há identificação? | Dentinho, cenas do site, peças sociais e combinação pastel permanecem ao longo da página. Há continuidade de identidade além do logotipo; reconhecimento por público real não foi testado nesta documentação. |
| Existe elemento proprietário ou específico? | O logotipo original com crianças e balões em formato de dentes, sua animação e as cenas reais da jornada do Dentinho vinculam a apresentação à Dra. Lívia. |
| As escolhas visuais resolvem necessidades concretas? | A câmera de rolagem demonstra a experiência do site; a composição desktop/celular mostra as duas apresentações; o SaaS separado distingue operação de comunicação; a galeria sem legendas dá espaço às peças. O fluxo normal preserva leitura quando a montagem não se aplica. |

## Limites e pendências

Esta passagem documentou o código final, os arquivos de direção existentes e a proveniência local. Não executou build, testes, navegador, capturas, medição de desempenho ou auditoria de acessibilidade. Não afirma ter verificado renders. Duração e peso do hero vieram da informação final do coordenador, sem nova medição de mídia.

Validação anterior à evolução da galeria, reportada pelo coordenador: builds e SEO aprovados nas duas cópias, ESLint dos três arquivos JavaScript, `git diff --check` e sete testes existentes aprovados. As conferências em desktop de `1280px` e mobile de `390px` não encontraram overflow ou imagens quebradas. Com o movimento desligado pelo controle global, as três cenas ficaram com opacidade `1` e os quatro vídeos pausados e mudos. Essa conferência pelo controle não é uma nova verificação documental da preferência do sistema. O reviewer independente encerrou o P1 do hero como resolvido. São evidências recebidas do coordenador, não execuções deste documentador.

Validação da nova galeria, recebida do coordenador: reviewer independente aprovou o visual nas capturas desktop `1440px`, viewport do usuário `1042px`, mobile `390px` e imagem ampliada. Em `1440px`, aparecem três peças inteiras; em `1042px`, duas inteiras mais partes das adjacentes. Pediu apenas a correção de retorno do foco, implementada com `restoringFocusRef` e confirmada funcionalmente pelo coordenador: Esc e o botão de fechar preservam a posição; Esc devolve o foco à peça. O teste por clique em coordenadas manteve tanto a rolagem vertical quanto a transformação horizontal idênticas antes e depois. Builds e SEO das duas cópias, ESLint dos dois arquivos JavaScript e `git diff --check` passaram na versão final. Os sete testes existentes passaram antes do último ajuste de foco. O controle global com movimento desligado também foi testado: a montagem cinematográfica é removida e as setas percorrem a faixa com overflow horizontal nativo. O reviewer independente encerrou a revisão com veredito `ship`. Esta documentação registra evidências recebidas do coordenador, sem repetir os testes.

Não foram acrescentados números de resultado, promessas clínicas, depoimentos ou afirmações de conformidade. A divergência de registro profissional já anotada entre papelaria e site continua pendente de validação antes de qualquer uso novo fora da reprodução das peças existentes. Este documento não a resolve nem repete o número.

O coordenador sincronizou estes dois documentos na cópia `CSAg-Site-Completo-2026-10-28`. A publicação e sua conferência ficam registradas em `livia-esper-publication.json`.

Publicação da galeria em 01/11/2026: Vercel `Ready` em 12s, deployment `BENTyZNejej4dTkiEtZe6uAKGU5X`. O coordenador verificou o alias público com seis peças, montagem cinematográfica ativa e nenhuma imagem carregada quebrada. Captura: `review/livia-social/publicado.jpg`.
