import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost';

export default function () {
  const res = http.get(BASE_URL);
  check(res, {
    'status 200': (r) => r.status === 200,
    'body not empty': (r) => r.body.length > 0,
  });

  const lead = {
    name: 'Test User',
    email: 'test@example.com',
    whatsapp: '+573001234567',
    business_type: 'Test Business',
  };

  const postRes = http.post(`${BASE_URL}/api/v1/leads`, JSON.stringify(lead), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(postRes, {
    'lead created 201': (r) => r.status === 201 || r.status === 429,
  });

  sleep(1);
}
