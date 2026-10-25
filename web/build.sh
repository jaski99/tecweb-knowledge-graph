#!/bin/sh
# Copia le fonti del grafo e la banca quiz (se presente) nella web app statica.
set -eu
ROOT=$(cd "$(dirname "$0")/.." && pwd)
cp "$ROOT/graph/graph.json" "$ROOT/web/graph.json"
if [ -f "$ROOT/graph/quiz.json" ]; then
  cp "$ROOT/graph/quiz.json" "$ROOT/web/quiz.json"
  echo "copiato graph/quiz.json -> web/quiz.json"
else
  printf '{"quiz":[]}\n' > "$ROOT/web/quiz.json"
fi
echo "copiato graph/graph.json -> web/graph.json"
