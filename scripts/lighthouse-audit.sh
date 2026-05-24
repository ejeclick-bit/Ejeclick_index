#!/usr/bin/env bash
set -euo pipefail

URL="${1:-http://localhost:5173}"
REPORT_DIR="reports/lighthouse"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$REPORT_DIR"

echo "→ Running Lighthouse audit on $URL"
echo "  Results will be saved to $REPORT_DIR/"

npx lighthouse "$URL" \
  --view \
  --output=html \
  --output=json \
  --output-path="$REPORT_DIR/report_$TIMESTAMP" \
  --preset=desktop \
  --quiet \
  --chrome-flags="--headless=new"

echo "✓ Report: $REPORT_DIR/report_$TIMESTAMP.html"

# Extract scores
SCORES=$(jq '.categories | {performance: .performance.score, accessibility: .accessibility.score, "best-practices": .["best-practices"].score, seo: .seo.score}' "$REPORT_DIR/report_$TIMESTAMP.json" 2>/dev/null || echo "{}")
echo "Scores: $SCORES"
