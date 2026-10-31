#!/bin/bash
set -u
cd -- "$(dirname -- "$0")"

csag_node="$(command -v node 2>/dev/null || true)"
if [ -z "$csag_node" ]; then
  for candidato in "$HOME/.nodejs/bin/node" "$HOME/.volta/bin/node" /opt/homebrew/bin/node /usr/local/bin/node; do
    if [ -x "$candidato" ]; then csag_node="$candidato"; break; fi
  done
fi
if [ -z "$csag_node" ]; then
  printf '%s\n' 'Node.js não foi encontrado. Instale pelo site https://nodejs.org e abra este atalho novamente.'
  read -r -p 'Pressione Enter para fechar.' resposta
  exit 1
fi

if [ ! -f dist/index.html ]; then
  printf '%s\n' 'A versão pronta do site não foi encontrada. Mantenha este atalho junto das pastas dist e src.'
  read -r -p 'Pressione Enter para fechar.' resposta
  exit 1
fi

csag_expected_build="$("$csag_node" --input-type=module -e 'import{createHash}from"node:crypto";import{readFileSync}from"node:fs";console.log(createHash("sha256").update(readFileSync("dist/index.html")).digest("hex").slice(0,12))')"
csag_existing="$(/usr/bin/curl --silent --fail --max-time 1 http://127.0.0.1:4173/.csag-preview.json 2>/dev/null || true)"
if [[ "$csag_existing" == *"csag-local-preview"* && "$csag_existing" == *"$csag_expected_build"* ]]; then
  /usr/bin/open 'http://127.0.0.1:4173/?cinema=4'
  exit 0
fi

if ! "$csag_node" preview-local.mjs --open; then
  printf '%s\n' 'A prévia não iniciou. Confira a mensagem acima e tente abrir este atalho novamente.'
  read -r -p 'Pressione Enter para fechar.' resposta
  exit 1
fi
