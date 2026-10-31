# Publicação e validação do SEO

28/10/2026. Preparado localmente, sem publicação nesta tarefa.

## Antes de trocar o site público

1. Publicar a versão de revisão em ambiente de preview na Vercel. Usar o código completo desta pasta, `npm ci`, build `npm run build` e saída `dist`. Não adicionar novamente o rewrite curinga para `/index.html`.
2. Confirmar que o domínio definitivo continuará sendo `https://comunicacaosocialag.com.br`. Esse domínio já é usado pela agência e foi adotado na configuração. Se outro domínio for escolhido, atualizar `SITE_URL` em `src/data/seo.js`, reconstruir e conferir todas as URLs geradas.
3. Conferir a versão de preview em mobile e desktop e validar que seu cabeçalho HTTP contém `X-Robots-Tag: noindex, follow`. A configuração inclui essa regra para domínios `*.vercel.app`. A proteção por login, se usada na prévia, deve ser retirada somente do domínio público quando ele for lançado.
4. No Search Console do site antigo, exportar páginas e consultas com tráfego. Conferir se existem URLs além das já mapeadas que precisam ser mantidas ou redirecionadas. Não redirecionar indiscriminadamente todo erro para a Home.
5. Rever editorialmente os registros do catálogo cujas provas e métricas não foram validadas. Eles estão fora da indexação. A copy foi mantida por instrução do Bruno. Completar os vídeos pendentes do case Dubola quando os arquivos finais forem fornecidos.
6. Conferir a configuração de medição e privacidade já existente, incluindo Clarity e o fluxo de contato. Não criar IDs de Analytics ou tokens de verificação de propriedade fictícios.

## Rotas antigas preparadas

| Origem existente | Destino preparado | Tipo |
| --- | --- | --- |
| `/about/` | `/agencia` | Permanente, 308 na configuração Vercel |
| `/vamos-conversar/` | `/contato` | Permanente, 308 |
| `/services/` | `/agencia#agency-disciplines-title` | Permanente, 308; disciplinas existentes, sem criar uma página de serviços não aprovada |
| `/?case=ID_CONHECIDO` | `/trabalhos/ID_CONHECIDO` | Permanente, 308 |

URLs com barra final podem receber normalização da Vercel antes do redirecionamento. Validar cadeias reais no lançamento e reduzir a uma etapa quando a plataforma permitir. Preservar a migração pelo tempo recomendado nas orientações atuais do Google; não retirar as regras logo após o lançamento. Fonte: [Google, migração de URLs](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

## No lançamento

1. Fazer o deploy aprovado e apontar o domínio na hospedagem. Manter uma única versão canônica HTTPS. Encaminhar `www` e variantes antigas para a versão escolhida, sem quebrar o subdomínio `cliente.comunicacaosocialag.com.br` ou os registros de e-mail.
2. Confirmar HTTPS, ausência de login e ausência de `noindex` no domínio de produção. A regra para `*.vercel.app` deve continuar ativa na prévia.
3. Rodar os comandos abaixo na raiz do projeto e revisar o resultado. A verificação de produção é separada da verificação local para não confundir o site antigo com esta versão.
4. Na propriedade verificada do Google Search Console, enviar `https://comunicacaosocialag.com.br/sitemap.xml`. Inspecionar Home, Agência e Dubola. Confirmar canônica selecionada, HTML renderizado e elegibilidade para indexação. Fazer a verificação equivalente no Bing Webmaster Tools se houver conta disponível.
5. Rodar o Rich Results Test nas páginas relevantes. A organização não tem endereço físico completo publicado; não inventar dados para obter elegibilidade.
6. Conferir o Perfil da Empresa no Google e os links nos perfis oficiais da agência. Adicionar o endereço público ou área de atendimento somente com dados confirmados.

```bash
npm run build
npm run check:seo
npm test
npm run check:live
```

A última linha consulta o domínio oficial já publicado. Pode validar uma versão de preview com `npm run check:live -- https://ENDERECO-REAL-DA-PREVIA.vercel.app`. Não executar com o exemplo literal. O teste não envia pedidos de indexação.

## Aceite técnico em produção

- Seis URLs do sitemap respondem 200 e mostram as canônicas oficiais corretas.
- URLs inexistentes e arquivos inexistentes respondem 404.
- Redirecionamentos antigos são permanentes e terminam na página adequada.
- `robots.txt` e `sitemap.xml` respondem como texto/XML, sem página de login ou Home disfarçada.
- Nenhuma regra de CDN, firewall ou autenticação bloqueia o conteúdo público ou os recursos necessários.
- Navegação interna atualiza title, descrição, canônica, OG e JSON-LD.
- Imagens e vídeos locais carregam. O formulário abre o WhatsApp com o briefing revisado; isso não comprova envio da mensagem pelo visitante.
- Medir Lighthouse mobile e PageSpeed no domínio final. Acompanhar dados de campo quando disponíveis. Metas do projeto: LCP < 2,5 s, INP < 200 ms, CLS < 0,1; ainda não comprovadas em produção.

## Resultado local desta entrega

Build e check de SEO: aprovados. Sete testes do reel: aprovados. Texto renderizado das 22 páginas: preservado. Lint dos arquivos modificados: aprovado. Lint global: pendências anteriores em outros arquivos, discriminadas no diagnóstico.

A revisão no navegador usa o servidor de prévia já aberto em `127.0.0.1:4174`, que lê a pasta entregue. Esse processo foi iniciado antes desta tarefa e ainda utiliza a política antiga de fallback. Por isso não serve como evidência do status HTTP 404 do servidor atualizado. A versão nova de `preview-local.mjs` foi conferida em código; para testar sua política HTTP, reiniciar o atalho após encerrar a prévia anterior. A tentativa de iniciar uma nova porta nesta sessão foi bloqueada pelo ambiente. O teste de produção permanece obrigatório.

Sem marcador de preenchimento no HTML público. Pendências de conta e publicação: DNS/hospedagem, propriedade do Search Console e Perfil da Empresa. Pendências editoriais: conteúdo adicional de serviços, comprovação dos demais cases e vídeos finais de eventos. Elas não foram preenchidas com suposições.
