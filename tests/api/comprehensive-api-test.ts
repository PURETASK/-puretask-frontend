// tests/api/comprehensive-api-test.ts
// Comprehensive API endpoint testing with real data

import axios from 'axios';

const BASE_URL = 'http://localhost:4000';
let authToken: string;
let userId: string;
let cleanerId: string;
let bookingId: string;

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  duration: number;
  error?: string;
}

const results: TestResult[] = [];

async function runTest(name: string, testFn: () => Promise<void>) {
  const start = Date.now();
  try {
    await testFn();
    const duration = Date.now() - start;
    results.push({ name, status: 'PASS', duration });
    console.log(`✅ ${name} (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - start;
    results.push({ 
      name, 
      status: 'FAIL', 
      duration, 
      error: (error as Error).message 
    });
    console.log(`❌ ${name} - ${(error as Error).message}`);
  }
}

async function testAllEndpoints() {
  console.log('🧪 COMPREHENSIVE API ENDPOINT TESTING\n');
  console.log('Testing against:', BASE_URL);
  console.log('='.repeat(50) + '\n');

  // ============================================
  // 1. AUTHENTICATION ENDPOINTS
  // ============================================
  console.log('🔐 1. AUTHENTICATION ENDPOINTS');
  
  await runTest('POST /auth/register (client)', async () => {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email: `test.client.${Date.now()}@test.com`,
      password: 'TestPass123!',
      role: 'client'
    });
    expect(response.status).toBe(201);
    expect(response.data.token).toBeDefined();
    authToken = response.data.token;
    userId = response.data.user.id;
  });

  await runTest('POST /auth/register (cleaner)', async () => {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email: `test.cleaner.${Date.now()}@test.com`,
      password: 'TestPass123!',
      role: 'cleaner'
    });
    expect(response.status).toBe(201);
    cleanerId = response.data.user.id;
  });

  await runTest('POST /auth/login', async () => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'client@test.com',
      password: 'TestPass123!'
    });
    expect(response.status).toBe(200);
    expect(response.data.token).toBeDefined();
    authToken = response.data.token;
    userId = response.data.user.id;
  });

  await runTest('GET /auth/me', async () => {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(response.status).toBe(200);
    expect(response.data.user.email).toBeDefined();
  });

  console.log('');

  // ============================================
  // 2. CLEANER ENDPOINTS
  // ============================================
  console.log('🧹 2. CLEANER ENDPOINTS');
  
  await runTest('GET /cleaner (list all)', async () => {
    const response = await axios.get(`${BASE_URL}/cleaner?limit=10`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.cleaners)).toBe(true);
  });

  await runTest('GET /cleaner/:id (specific cleaner)', async () => {
    const response = await axios.get(`${BASE_URL}/cleaner/${cleanerId}`);
    expect(response.status).toBe(200);
    expect(response.data.cleaner).toBeDefined();
  });

  await runTest('GET /cleaner/search (with filters)', async () => {
    const response = await axios.get(`${BASE_URL}/cleaner/search`, {
      params: {
        city: 'San Francisco',
        minRating: 4.0,
        maxRate: 100
      }
    });
    expect(response.status).toBe(200);
  });

  console.log('');

  // ============================================
  // 3. BOOKING/JOB ENDPOINTS
  // ============================================
  console.log('📅 3. BOOKING/JOB ENDPOINTS');
  
  await runTest('POST /jobs (create booking)', async () => {
    const response = await axios.post(`${BASE_URL}/jobs`, {
      cleanerId: cleanerId,
      serviceType: 'standard',
      durationHours: 3,
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      address: '123 Test St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(response.status).toBe(201);
    bookingId = response.data.job.id;
  });

  await runTest('GET /jobs (list bookings)', async () => {
    const response = await axios.get(`${BASE_URL}/jobs`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(response.status).toBe(200);
  });

  await runTest('GET /jobs/:id (specific booking)', async () => {
    const response = await axios.get(`${BASE_URL}/jobs/${bookingId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(response.status).toBe(200);
    expect(response.data.job.id).toBe(bookingId);
  });

  await runTest('PATCH /jobs/:id (update booking)', async () => {
    const response = await axios.patch(`${BASE_URL}/jobs/${bookingId}`, {
      specialInstructions: 'Please use eco-friendly products'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(response.status).toBe(200);
  });

  console.log('');

  // ============================================
  // 4. MESSAGE ENDPOINTS
  // ============================================
  console.log('💬 4. MESSAGE ENDPOINTS');
  
  await runTest('POST /messages (send message)', async () => {
    const response = await axios.post(`${BASE_URL}/messages`, {
      receiverId: cleanerId,
      content: 'Hello! Looking forward to the cleaning.'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(response.status).toBe(201);
  });

  await runTest('GET /messages (list conversations)', async () => {
    const response = await axios.get(`${BASE_URL}/messages`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(response.status).toBe(200);
  });

  console.log('');

  // ============================================
  // 5. PAYMENT ENDPOINTS
  // ============================================
  console.log('💰 5. PAYMENT ENDPOINTS');
  
  await runTest('GET /credits/balance', async () => {
    const response = await axios.get(`${BASE_URL}/credits/balance`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(response.status).toBe(200);
    expect(typeof response.data.balance).toBe('number');
  });

  await runTest('POST /payments/intent (create payment)', async () => {
    const response = await axios.post(`${BASE_URL}/payments/intent`, {
      amount: 5000, // $50.00
      currency: 'usd'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(response.status).toBe(200);
  });

  console.log('');

  // ============================================
  // 6. REVIEW ENDPOINTS
  // ============================================
  console.log('⭐ 6. REVIEW ENDPOINTS');
  
  await runTest('GET /cleaner/:id/reviews', async () => {
    const response = await axios.get(`${BASE_URL}/cleaner/${cleanerId}/reviews`);
    expect(response.status).toBe(200);
  });

  console.log('');

  // ============================================
  // 7. ADMIN ENDPOINTS (if admin token available)
  // ============================================
  console.log('👑 7. ADMIN ENDPOINTS');
  
  await runTest('GET /admin/analytics (requires admin)', async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      // May return 403 if not admin
      expect([200, 403]).toContain(response.status);
    } catch (error: any) {
      if (error.response?.status === 403) {
        // Expected for non-admin users
        return;
      }
      throw error;
    }
  });

  console.log('');

  // ============================================
  // 8. HEALTH & STATUS ENDPOINTS
  // ============================================
  console.log('🏥 8. HEALTH & STATUS ENDPOINTS');
  
  await runTest('GET /health', async () => {
    const response = await axios.get(`${BASE_URL}/health`);
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('ok');
  });

  await runTest('GET /health/ready', async () => {
    const response = await axios.get(`${BASE_URL}/health/ready`);
    expect(response.status).toBe(200);
    expect(response.data.database).toBe('connected');
  });

  console.log('');

  // ============================================
  // PRINT SUMMARY
  // ============================================
  printSummary();
}

function printSummary() {
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const total = results.length;
  const passRate = ((passed / total) * 100).toFixed(1);
  
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / total;

  console.log(`\nTotal Tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Pass Rate: ${passRate}%`);
  console.log(`Avg Response Time: ${avgDuration.toFixed(0)}ms`);

  if (failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`   - ${r.name}: ${r.error}`);
    });
  }

  console.log('\n' + '='.repeat(50));
  
  if (passRate === '100.0') {
    console.log('🎉 ALL TESTS PASSED!');
  } else if (parseFloat(passRate) >= 90) {
    console.log('⚠️  MOST TESTS PASSED');
  } else {
    console.log('❌ MULTIPLE FAILURES - NEEDS ATTENTION');
  }
}

function expect(actual: any) {
  return {
    toBe: (expected: any) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toBeDefined: () => {
      if (actual === undefined || actual === null) {
        throw new Error('Expected value to be defined');
      }
    },
    toContain: (expected: any) => {
      if (!actual.includes(expected)) {
        throw new Error(`Expected array to contain ${expected}`);
      }
    }
  };
}

// Run tests
testAllEndpoints()
  .then(() => {
    const failed = results.filter(r => r.status === 'FAIL').length;
    process.exit(failed > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });

