#!/bin/sh
# Copia la fonte unica graph/graph.json nella web app (web/graph.json, ignorato da git).
set -eu
ROOT=$(cd "$(dirname "$0")/.." && pwd)
cp "$ROOT/graph/graph.json" "$ROOT/web/graph.json"
if [ -f "$ROOT/graph/quiz.json" ]; then
  cp "$ROOT/graph/quiz.json" "$ROOT/web/quiz.json"
fi
echo "copiato graph/graph.json -> web/graph.json"
[ ! -f "$ROOT/graph/quiz.json" ] || echo "copiato graph/quiz.json -> web/quiz.json"
