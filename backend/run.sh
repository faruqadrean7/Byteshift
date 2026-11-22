#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR/.."

# Ensure Homebrew expat library path is loaded if needed on macOS
if [ -d "/opt/homebrew/opt/expat/lib" ]; then
  export DYLD_LIBRARY_PATH="/opt/homebrew/opt/expat/lib:${DYLD_LIBRARY_PATH:-}"
fi

source "$DIR/venv/bin/activate"
export PYTHONPATH="$DIR/.."

echo "🚀 Memulai FastAPI server di http://127.0.0.1:8000..."
echo "📖 Swagger API Docs tersedia di http://127.0.0.1:8000/docs"

exec uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
