# CS Ag: a voz em movimento

Direção explicitamente definida pelo usuário: logo como caixas de som, abertura com variações de materiais, 3D cinematográfico ao longo do site e portfólio imersivo. Esta direção prevalece sobre alternativas automáticas. Implementação direta com os assets existentes, sem geração paga.

## Mundo visual
Um único palco escuro e contínuo. O objeto 3D atravessa enquadramentos amplos, laterais e de detalhe. O movimento da rolagem monta a narrativa. O site não usa uma sucessão de cartões de serviços.

## Identidade
- Amarelo da marca: #f7d406, assinatura e ação.
- Preto de palco: #070709, espaço contínuo.
- Branco de leitura: #f5f5f7, texto principal.
- Grafite: #1d1d1b, volume e superfícies.
- Cinza claro: #a6a6a9, texto secundário.
- Syne para títulos e Plus Jakarta Sans para leitura, já utilizadas no projeto.

## Primeira tela
Modelo 3D frontal centralizado sobre o palco preto, acompanhado de slogan, logo e navegação. O enquadramento final da intro é o primeiro enquadramento da home, com o mesmo objeto, posição e escala. O slogan ocupa a base esquerda em duas escalas tipográficas. Nenhuma caixa arredondada ou estatística demonstrativa. Um convite a explorar o portfólio.

O reel institucional pertence à página Agência, depois das áreas de atuação e antes das marcas do acervo. Ocupa a largura útil em 16:9, sem corte. O mesmo vídeo alterna entre uma prévia muda dos primeiros dez segundos e o filme completo com som, reiniciado por clique. O áudio é silenciado no próprio enquadramento, sem modal. Um indicador acompanha o ponteiro no desktop; no toque, o convite para assistir é fixo. Há pausa explícita, pausa e silêncio fora da tela e da aba, fallback de erro e respeito a movimento reduzido.

## Agência e Abordagem
Páginas irmãs em /agencia e /abordagem, com layout, tipografia, ritmo editorial e navegação compartilhados. Um seletor acompanha o conteúdo: vertical à esquerda no desktop, horizontal no cabeçalho móvel. Agência apresenta posicionamento, peças reais em movimento, quem somos, propósito, disciplinas, reel e marcas do acervo. Abordagem apresenta pensamento, quatro movimentos do método e critérios de clareza, responsabilidade e aprendizado. O método deixa de estar duplicado na Agência. Ambas usam o mesmo conteúdo factual na renderização estática e na interface.

A faixa de campanhas mostra somente imagens, sem legendas ou identificações visíveis. Todos os quadros têm o mesmo tamanho, proporção 4:3, espaçamento e alinhamento. As imagens atuais serão substituídas posteriormente. O reel usa a largura da página, com margens discretas, e seu quadro tem largura explícita de 100% e proporção 16:9. A versão HTML inicial também recebe dimensões explícitas, para não depender do tamanho padrão do navegador.

## Percurso e assinatura
Abertura de materiais: símbolo reconhecível, cortes alinhados, chegada ao objeto. A cena segue para escuta, transformação e amplificação através de posições, câmera, luz e escala. No portfólio, as imagens reais atravessam um palco em perspectiva e se tornam o assunto central. A cena retorna no contato.

## Movimento
Uma direção contínua, não efeitos independentes. GSAP ScrollTrigger controla a montagem; React Three Fiber interpola poses do modelo. Entradas de texto usam recorte tipográfico; projetos usam profundidade, perspectiva e recorte. Sem explosão, estrelas ou brilho cósmico.

## Continuidade e controle
Intro em toda abertura de documento na home, pulável, sem bloquear páginas internas. Movimento reduzido recebe leitura estática completa. Casos abrem em apresentação ampliada; todos são navegáveis por índice e teclado. Mobile usa câmera e escala próprias. Falha de WebGL preserva a navegação e as peças.

## Conteúdo
Peças fornecidas no acervo. Não exibir métricas ou datas de performance sem evidência. Trabalhos da trajetória anterior são identificados como acervo profissional.
