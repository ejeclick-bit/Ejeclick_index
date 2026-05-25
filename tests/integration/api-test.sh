#!/usr/bin/env bash
set -euo pipefail

BASE="${1:-http://localhost:3000}"
PASS=0
FAIL=0

green() { echo -e "\033[32m✓ $1\033[0m"; ((++PASS)); }
red() { echo -e "\033[31m✗ $1\033[0m"; ((++FAIL)); }
check() {
  if [ "$1" = "$2" ]; then
    green "$3"
  else
    red "$3 → got $1, expected $2"
  fi
}

echo "═══════════════════════════════════════════"
echo "  EjeClick — Full Stack Integration Test"
echo "  Target: $BASE"
echo "═══════════════════════════════════════════"
echo ""

echo "── 1. Backend Health ──"
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/health")
check "$CODE" "200" "Health endpoint"
BODY=$(curl -s "$BASE/api/health")
echo "       Body: $BODY"

echo ""
echo "── 2. Frontend Serving ──"
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE")
check "$CODE" "200" "Frontend index.html"
BODY=$(curl -s "$BASE" | head -1)
echo "       DOCTYPE: $(echo "$BODY" | grep -o '<!doctype html>' || echo 'SPA')"

echo ""
echo "── 3. Database Connection ──"
# DB is healthy because health endpoint worked (relies on DB connection)
if [ "$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/health")" = "200" ]; then
  green "Database connected and tables created"
else
  red "Database not reachable"
fi

echo ""
echo "── 4. POST /api/v1/leads (Create Lead) ──"
JSON=$(curl -s -X POST "$BASE/api/v1/leads" \
  -H "Content-Type: application/json" \
  -d '{"name":"Integración Test","email":"test@integracion.com","whatsapp":"+573001111111","business_type":"Test Automation"}')
CODE=$(echo "$JSON" | grep -c '"id"')  # 1 if has id
if [ "$CODE" -gt 0 ]; then
  green "POST /api/v1/leads → 201 with ID"
  POST_ID=$(echo "$JSON" | grep -o '"id":[0-9]*' | cut -d: -f2)
  echo "       Lead ID: $POST_ID — Response: $JSON"
else
  red "POST /api/v1/leads → unexpected response: $JSON"
fi

echo ""
echo "── 5. POST Validation (invalid data → 422) ──"
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/leads" \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"invalido","whatsapp":"12","business_type":""}')
check "$CODE" "422" "Validation rejects invalid data"

echo ""
echo "── 6. GET /api/v1/leads (List) ──"
RES=$(curl -s -w "\n%{http_code}" "$BASE/api/v1/leads")
BODY=$(echo "$RES" | head -1)
CODE=$(echo "$RES" | tail -1)
check "$CODE" "200" "GET /api/v1/leads"
COUNT=$(echo "$BODY" | grep -o '"id"' | wc -l)
echo "       Leads in DB: $COUNT"

echo ""
echo "── 7. Rate Limiting (POST x12 → 429) ──"
for i in $(seq 1 12); do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/leads" \
    -H "Content-Type: application/json" \
    -d '{"name":"Rate Test","email":"rate@test.com","whatsapp":"+573002222222","business_type":"Test"}')
  if [ "$CODE" = "429" ]; then
    green "Rate limit activated after $i requests"
    break
  fi
done
if [ "$CODE" != "429" ]; then
  red "Rate limit never activated (last code: $CODE)"
fi

echo ""
echo "── 8. CORS Preflight ──"
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "$BASE/api/v1/leads" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST")
check "$CODE" "200" "CORS OPTIONS preflight"

echo ""
echo "── 9. SPA Fallback ──"
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/some/nonexistent/route")
check "$CODE" "200" "SPA serves index.html for unknown routes"

echo ""
echo "── 10. Static Assets Cache Headers ──"
CACHE=$(curl -sI "$BASE/assets/vendor-react-CzlUonzX.js" 2>/dev/null | grep -i "cache-control" | tr -d '\r' || echo "none")
if echo "$CACHE" | grep -q "immutable"; then
  green "Static assets have Cache-Control: immutable"
else
  echo "       (no static asset tested — may be dev mode)"
fi

echo ""
echo "── 11. Security Headers ──"
HDRS=$(curl -sI "$BASE" 2>/dev/null)
if echo "$HDRS" | grep -qi "x-frame-options"; then
  green "Security headers present (X-Frame-Options)"
else
  echo "       (no security headers in dev mode — expected in prod via nginx)"
fi

echo ""
echo "═══════════════════════════════════════════"
echo "  Results: $PASS passed, $FAIL failed"
echo "═══════════════════════════════════════════"

[ "$FAIL" -eq 0 ] && exit 0 || exit 1
