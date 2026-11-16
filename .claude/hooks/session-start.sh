#!/bin/bash
# Prepara cada sessão do Claude Code na nuvem:
#  1) instala o gstack (skills de desenvolvimento) se não estiver instalado
#  2) instala as dependências do projeto (Remotion, Three.js...) quando mudarem
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

# --- gstack (global, fora do repositório) ---
GSTACK_DIR="$HOME/.claude/skills/gstack"
if [ ! -f "$GSTACK_DIR/SKILL.md" ]; then
  export PATH="$HOME/.bun/bin:$PATH"
  if ! command -v bun >/dev/null; then
    npm install -g bun >&2
  fi
  rm -rf "$GSTACK_DIR"
  git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git "$GSTACK_DIR" >&2
  (cd "$GSTACK_DIR" && ./setup) >&2
fi

# --- dependências npm do projeto ---
hashes=node_modules/.session-start.sha256
if ! sha256sum --check --status "$hashes" 2>/dev/null; then
  rm -f "$hashes"
  npm install --no-fund --no-audit >&2
  sha256sum .claude/hooks/session-start.sh package.json package-lock.json 2>/dev/null > "$hashes" || rm -f "$hashes"
fi
