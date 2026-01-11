// tests/performance/load-test.js
// k6 load testing script for PureTask API

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 50 },   // Ramp up to 50 users
    { duration: '2m', target: 50 },   // Stay at 50 users
    { duration: '30s', target: 100 }, // Ramp up to 100 users
    { duration: '1m', target: 100 },  // Stay at 100 users
    { duration: '30s', target: 0 },   // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.1'],    // Error rate should be less than 10%
    errors: ['rate<0.1'],
  },
};

const BASE_URL = 'http://localhost:4000';

// Test data
const testUsers = [
  { email: 'loadtest1@test.com', password: 'TestPass123!' },
  { email: 'loadtest2@test.com', password: 'TestPass123!' },
  { email: 'loadtest3@test.com', password: 'TestPass123!' },
];

export default function () {
  // 1. Test health endpoint
  let response = http.get(`${BASE_URL}/health`);
  check(response, {
    'health check is 200': (r) => r.status === 200,
    'health check response time < 200ms': (r) => r.timings.duration < 200,
  }) || errorRate.add(1);

  sleep(1);

  // 2. Test login
  const user = testUsers[Math.floor(Math.random() * testUsers.length)];
  response = http.post(`${BASE_URL}/auth/login`, JSON.stringify(user), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  const loginSuccess = check(response, {
    'login is 200': (r) => r.status === 200,
    'login returns token': (r) => r.json('token') !== undefined,
    'login response time < 500ms': (r) => r.timings.duration < 500,
  });

  if (!loginSuccess) {
    errorRate.add(1);
    return;
  }

  const token = response.json('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  sleep(1);

  // 3. Test getting current user
  response = http.get(`${BASE_URL}/auth/me`, { headers });
  check(response, {
    'get user is 200': (r) => r.status === 200,
    'get user response time < 300ms': (r) => r.timings.duration < 300,
  }) || errorRate.add(1);

  sleep(1);

  // 4. Test getting cleaners list
  response = http.get(`${BASE_URL}/cleaner?limit=10`, { headers });
  check(response, {
    'get cleaners is 200': (r) => r.status === 200,
    'get cleaners response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  sleep(2);

  // 5. Test getting jobs
  response = http.get(`${BASE_URL}/jobs`, { headers });
  check(response, {
    'get jobs status is ok': (r) => r.status === 200 || r.status === 404,
    'get jobs response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  sleep(1);
}

// Setup function - runs once at the start
export function setup() {
  console.log('Setting up load test...');
  
  // Register test users if they don't exist
  testUsers.forEach(user => {
    http.post(`${BASE_URL}/auth/register`, JSON.stringify({
      ...user,
      role: 'client',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  });
  
  console.log('Load test setup complete');
}

// Teardown function - runs once at the end
export function teardown(data) {
  console.log('Load test completed');
}

