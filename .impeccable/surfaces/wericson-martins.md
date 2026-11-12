# Wericson Martins | O consultório em foco

O case apresenta a identidade digital e o sistema de gestão do consultório de Wericson Martins na rota `/trabalhos/wericson-martins`. A abertura combina o painel desktop e mobile. O capítulo sobre a prática psicanalítica acompanha o percurso do analisante. As telas de login e bloqueio por PIN integram a seção sobre segurança de dados e LGPD.

O case usa vinho e marfim, tipografia editorial e tokens no CSS da rota, com a assinatura dupla compartilhada. A chamada da abertura leva à rotina. As telas aparecem sem legendas e abrem em tamanho maior em uma nova aba, com ícone de ampliação visível no toque. O CSS respeita a preferência por movimento reduzido.

## Evidência e verificação

- Nove capturas reais do aplicativo em WebP, feitas a 1280 × 720 e 390 × 844, mais uma versão reduzida do painel desktop. A aplicação rodou em ambiente local isolado com dados fictícios. A tela de acesso usou o componente original no estado desautenticado, com renderização local e sem autenticação remota. A procedência consta em `public/assets/cases/wericson-martins/provenance.json`.
- A inspeção visual do case a 1280 px e 390 px confirmou a ausência de rolagem horizontal. A compilação da prévia rodou em ambiente isolado, com dependências restauradas e arquivos do case Taciana trazidos de uma cópia existente, pois faltam no checkout ativo.
