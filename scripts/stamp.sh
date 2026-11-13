#!/usr/bin/env bash
# Escribe la fecha de hoy (UTC, AAAA-MM-DD) en la barra de estado de index.html
# y en <lastmod> de sitemap.xml. Ejecutar antes de hacer commit:
#   ./scripts/stamp.sh && git add -A && git commit -m "Actualiza contenido"
set -euo pipefail
cd "$(dirname "$0")/.."
today="$(date -u +%F)"
sed -i -E "s#<time datetime=\"[0-9]{4}-[0-9]{2}-[0-9]{2}\">[0-9]{4}-[0-9]{2}-[0-9]{2}</time>#<time datetime=\"${today}\">${today}</time>#" index.html
sed -i -E "s#<lastmod>[0-9]{4}-[0-9]{2}-[0-9]{2}</lastmod>#<lastmod>${today}</lastmod>#g" sitemap.xml
echo "updated: ${today}"
