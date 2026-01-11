// tests/performance/comprehensive-load-test.js
// Advanced load testing with multiple scenarios

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

// Custom metrics
const errorRate = new Rate('errors');
const bookingDuration = new Trend('booking_duration');
const apiDuration = new Trend('api_response_time');
const successfulBookings = new Counter('successful_bookings');

// Test configuration
export const options = {
  scenarios: {
    // Scenario 1: Gradual Ramp-up
    gradual_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 20 },  // Ramp to 20 users
        { duration: '3m', target: 50 },  // Ramp to 50 users
        { duration: '5m', target: 50 },  // Stay at 50
        { duration: '2m', target: 100 }, // Spike to 100
        { duration: '3m', target: 100 }, // Hold at 100
        { duration: '2m', target: 0 },   // Ramp down
      ],
      gracefulRampDown: '30s',
    },
    
    // Scenario 2: Spike Test
    spike_test: {
      executor: 'ramping-vus',
      startTime: '20m',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 100 },  // Sudden spike
        { duration: '1m', target: 100 },   // Hold spike
        { duration: '10s', target: 0 },    // Sudden drop
      ],
    },
    
    // Scenario 3: Constant Load
    constant_load: {
      executor: 'constant-vus',
      vus: 30,
      duration: '10m',
      startTime: '25m',
    },
  },
  
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% under 1s
    http_req_failed: ['rate<0.05'],     // Error rate < 5%
    errors: ['rate<0.1'],
    booking_duration: ['p(95)<3000'],   // Booking flow < 3s
    api_response_time: ['p(95)<500'],   // API < 500ms
  },
};

const BASE_URL = 'http://localhost:4000';

// Test data
const TEST_USERS = [
  { email: 'loadtest1@test.com', password: 'TestPass123!' },
  { email: 'loadtest2@test.com', password: 'TestPass123!' },
  { email: 'loadtest3@test.com', password: 'TestPass123!' },
  { email: 'loadtest4@test.com', password: 'TestPass123!' },
  { email: 'loadtest5@test.com', password: 'TestPass123!' },
];

export function setup() {
  console.log('🚀 Starting comprehensive load test...');
  console.log(`Testing: ${BASE_URL}`);
  
  // Create test users if they don't exist
  TEST_USERS.forEach(user => {
    http.post(`${BASE_URL}/auth/register`, JSON.stringify({
      ...user,
      role: 'client',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  });
  
  console.log('✅ Test users ready');
  return { baseUrl: BASE_URL };
}

export default function (data) {
  const user = TEST_USERS[Math.floor(Math.random() * TEST_USERS.length)];
  
  group('Authentication', function () {
    // Test login
    const loginStart = Date.now();
    const loginRes = http.post(`${data.baseUrl}/auth/login`, 
      JSON.stringify(user),
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    const loginDuration = Date.now() - loginStart;
    apiDuration.add(loginDuration);
    
    const loginSuccess = check(loginRes, {
      'login status 200': (r) => r.status === 200,
      'has token': (r) => r.json('token') !== undefined,
      'login < 500ms': (r) => r.timings.duration < 500,
    });
    
    if (!loginSuccess) {
      errorRate.add(1);
      return;
    }
    
    const token = loginRes.json('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    sleep(1);
    
    // Test getting user profile
    const meRes = http.get(`${data.baseUrl}/auth/me`, { headers });
    check(meRes, {
      'profile status 200': (r) => r.status === 200,
      'profile < 300ms': (r) => r.timings.duration < 300,
    }) || errorRate.add(1);
    
    sleep(1);
    
    group('Browse Cleaners', function () {
      // Search cleaners
      const cleanersRes = http.get(`${data.baseUrl}/cleaner?limit=10`, { headers });
      
      check(cleanersRes, {
        'cleaners status 200': (r) => r.status === 200,
        'cleaners < 500ms': (r) => r.timings.duration < 500,
        'has cleaners': (r) => r.json('cleaners').length > 0,
      }) || errorRate.add(1);
      
      const cleaners = cleanersRes.json('cleaners');
      if (cleaners && cleaners.length > 0) {
        const randomCleaner = cleaners[Math.floor(Math.random() * cleaners.length)];
        
        // View cleaner profile
        const cleanerRes = http.get(
          `${data.baseUrl}/cleaner/${randomCleaner.id}`, 
          { headers }
        );
        
        check(cleanerRes, {
          'cleaner profile status 200': (r) => r.status === 200,
          'cleaner profile < 400ms': (r) => r.timings.duration < 400,
        }) || errorRate.add(1);
      }
    });
    
    sleep(2);
    
    group('Create Booking', function () {
      const bookingStart = Date.now();
      
      // Create booking
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      
      const bookingRes = http.post(`${data.baseUrl}/jobs`, 
        JSON.stringify({
          cleanerId: 'random-cleaner-id', // In real test, use actual ID
          serviceType: 'standard',
          durationHours: 3,
          scheduledDate: futureDate.toISOString(),
          address: '123 Load Test St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
        }),
        { headers }
      );
      
      const bookingTime = Date.now() - bookingStart;
      bookingDuration.add(bookingTime);
      
      const bookingSuccess = check(bookingRes, {
        'booking created': (r) => r.status === 201 || r.status === 200,
        'booking < 1000ms': (r) => r.timings.duration < 1000,
      });
      
      if (bookingSuccess) {
        successfulBookings.add(1);
      } else {
        errorRate.add(1);
      }
    });
    
    sleep(1);
    
    group('View Bookings', function () {
      const bookingsRes = http.get(`${data.baseUrl}/jobs`, { headers });
      
      check(bookingsRes, {
        'bookings status 200': (r) => r.status === 200,
        'bookings < 500ms': (r) => r.timings.duration < 500,
      }) || errorRate.add(1);
    });
    
    sleep(2);
    
    group('Messages', function () {
      // List messages
      const messagesRes = http.get(`${data.baseUrl}/messages`, { headers });
      
      check(messagesRes, {
        'messages status 200': (r) => r.status === 200,
        'messages < 500ms': (r) => r.timings.duration < 500,
      }) || errorRate.add(1);
    });
    
    sleep(1);
  });
}

export function handleSummary(data) {
  return {
    'load-test-report.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  const summary = [];
  
  summary.push('\n' + '='.repeat(50));
  summary.push('📊 LOAD TEST SUMMARY');
  summary.push('='.repeat(50));
  
  const metrics = data.metrics;
  
  summary.push('\n🎯 Key Metrics:');
  summary.push(`  Total Requests: ${metrics.http_reqs.values.count}`);
  summary.push(`  Failed Requests: ${metrics.http_req_failed.values.passes} (${(metrics.http_req_failed.values.rate * 100).toFixed(2)}%)`);
  summary.push(`  Avg Response Time: ${metrics.http_req_duration.values.avg.toFixed(0)}ms`);
  summary.push(`  P95 Response Time: ${metrics.http_req_duration.values['p(95)'].toFixed(0)}ms`);
  summary.push(`  P99 Response Time: ${metrics.http_req_duration.values['p(99)'].toFixed(0)}ms`);
  
  if (metrics.successful_bookings) {
    summary.push(`  Successful Bookings: ${metrics.successful_bookings.values.count}`);
  }
  
  summary.push('\n✅ Threshold Results:');
  Object.keys(data.thresholds).forEach(key => {
    const threshold = data.thresholds[key];
    const status = threshold.ok ? '✅' : '❌';
    summary.push(`  ${status} ${key}`);
  });
  
  summary.push('\n' + '='.repeat(50));
  
  const allPassed = Object.values(data.thresholds).every(t => t.ok);
  if (allPassed) {
    summary.push('🎉 ALL THRESHOLDS PASSED!');
  } else {
    summary.push('⚠️  SOME THRESHOLDS FAILED');
  }
  
  summary.push('='.repeat(50) + '\n');
  
  return summary.join('\n');
}

