disposition: fix

## persistence

PASS. `PRODUCT.md` existe e preserva posicionamento, limites e verdade do portfólio. `DESIGN.md` descreve o mundo já estabelecido: palco preto, Syne monumental, branco/amarelo e montagem cinematográfica. A direção específica está em `.impeccable/surfaces/dubola-showcase.md`. Não há comp aprovado: esta é uma extensão de mundo existente com composição explicitamente prescrita pelo usuário. Roll, seed e estados de reprodução de comp não se aplicam, conforme a exceção do workflow confirmada pelo agente responsável.

As 16 capturas exigidas foram abertas. A captura substituída `mobile-360-contact.png` agora mostra título, CTA, contato alternativo e rodapé em 360 × 800. A captura digital móvel mostra uma transição coerente com a montagem. Nenhuma falha de evidência permanece. Build, lint de escopo, SEO e verificações de reprodução foram informados no manifesto, não reexecutados nesta revisão. O detector informado está limpo e não foi repetido. A preservação dos 292 hashes da home foi informada pelo agente responsável; nenhum arquivo da home foi alterado por esta revisão.

## fidelity

| Elemento ou promessa | Estado | Evidência |
| --- | --- | --- |
| TYPE | match | Syne largo, pesado e monumental domina hero e contato. O pedido explícito de tipologia grande prevalece sobre o limite geral de tamanho do piso. |
| MATERIAL | match | Filme, recortes fotográficos de embalagens e mockups reais conduzem a exposição. Não há imitação de matéria por CSS nem quadros de apresentação. |
| GROUND | match | Preto #070709, branco #f5f5f7 e amarelo #f7d406 seguem o mundo da home; vermelho e branco vêm da apresentação Dubola. Nenhum desvio de temperatura que contradiga a direção. |
| FIRST VIEWPORT | match | Filme fornecido ocupa a tela, DUBOLA atravessa a largura e controles de pausa/som aparecem. 1440, 1042 e 390 preservam essa topologia. |
| Adaptação do filme móvel | adaptation | O recorte para o painel vertical ativo é previsto expressamente em FIRST VIEWPORT e preserva a apresentação em tela cheia. |
| THESIS | match | Uma declaração curta e peças de disciplinas diferentes substituem a narrativa rejeitada, sem antes/depois, capítulos ou legendas de cada arte. |
| FORM: embalagens | contradicted | `mobile-390-products.png` perde a mostarda e deixa ketchup/goiaba cortados pelo topo; a maionese vira uma faixa lateral, enquanto grande parte da metade inferior fica vazia. Em desktop, a mostarda também aparece só como fragmento na borda. A montagem não apresenta esse trabalho com a presença prometida. |
| FORM: aplicações, sinalização e digital | match | Avental, saco e pano ocupam todo o palco; windbanners preservam o campo branco/vermelho; landing aparece sem moldura. A faixa da campanha no limite direito do digital móvel é o wipe em andamento, não uma quebra de layout. |
| MOTION THESIS | match | O código define uma única montagem GSAP com perspectiva, deslocamento de objetos, planos e máscaras direcionais. A observação de funcionamento consta no manifesto. |
| FALLBACK | contradicted | A exposição estática completa foi observada, mas `CampaignVideo` recebe `active=false` quando o movimento é desligado e não oferece controle de reprodução manual. A promessa de vídeo manual no fallback fica incompleta. |
| Navegação sobre as peças | contradicted | Texto/ícones brancos perdem contraste nas áreas claras do pano e dos windbanners; o link de volta também perde seu nome acessível quando seu texto é removido do fluxo acessível no mobile. |
| Piso: ausência de eyebrow | contradicted | “Comunicação Social Ag para Dubola.” funciona como uma pequena linha de identificação imediatamente acima do título do contato. O piso proíbe esse eyebrow; o crédito pode ir para o rodapé. |

## ceiling

A direção usa os recursos nativos que o pedido exige: enquadramento integral, escala tipográfica, matéria fotográfica e montagem por rolagem. O teto fica bloqueado pela composição móvel das embalagens e pela navegação sem contraste suficiente. Acrescentar ornamentação não resolveria essas duas perdas de acabamento.

## material_fixes

1. FORM, composição principal: em `src/pages/dubola-showcase.css:65–69,123–126` e `src/pages/DubolaShowcasePage.jsx:126–135`, normalize a ancoragem das embalagens entre o `translate(-50%,-50%)` do CSS e os percentuais GSAP, depois componha posições e escalas próprias para mobile. A mostarda precisa aparecer como peça reconhecível; os rótulos não podem ficar todos espremidos contra topo e bordas com o restante do palco vazio. Garanta um momento legível antes da entrada do avental e recapture início/meio/fim dessa cena em 390 × 844 e 1440 × 900.
2. Piso, contraste: em `src/pages/dubola-showcase.css:27–31`, dê ao cabeçalho uma proteção de contraste suficiente durante todas as cenas, preservando seu caráter flutuante. No fundo adjacente ao link de volta das capturas de windbanner e pano, a razão aproximada de #f5f5f7 é 2,18:1 e 2,16:1, abaixo de 4,5:1 para o texto pequeno; o ícone móvel também cai para cerca de 2,24:1. Não cubra a arte com um box de apresentação.
3. FALLBACK, reprodução: em `src/pages/DubolaShowcasePage.jsx:56–67,214`, ofereça reprodução e pausa manuais para a campanha quando o movimento global ou a preferência de movimento reduzido desativarem o autoplay. Mantenha pausa fora da cena e com a aba oculta. Verifique esse controle no fluxo estático.
4. Piso, eyebrow: em `src/pages/DubolaShowcasePage.jsx:219–224` e CSS de contato, retire o crédito pequeno de cima de “Sua marca. Por inteiro.” e, se necessário, integre-o ao rodapé. Preserve o título monumental.
5. Acessibilidade da navegação: em `src/pages/DubolaShowcasePage.jsx:180` e `src/pages/dubola-showcase.css:103`, dê ao link de volta um `aria-label="Voltar ao início"` permanente; `display:none` remove o único texto que hoje o nomeia no mobile.

## keep

Preservar a home integralmente, o filme fornecido na hero em tela cheia, a Syne enorme, preto/branco/amarelo, o vermelho Dubola, as peças sem cards/boxes/legendas e a exposição multidisciplinar conduzida pelo movimento.
