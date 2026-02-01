// tests/api/quick-api-test.ts
// Quick API endpoint testing

const BASE_URL = 'http://localhost:4000';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  duration: number;
}

const results: TestResult[] = [];

async function runTest(name: string, testFn: () => Promise<void>) {
  const start = Date.now();
  try {
    await testFn();
    const duration = Date.now() - start;
    results.push({ name, status: 'PASS', duration });
    console.log(`✅ ${name} (${duration}ms)`);
    return true;
  } catch (error) {
    const duration = Date.now() - start;
    results.push({ name, status: 'FAIL', duration });
    console.log(`❌ ${name} - ${(error as Error).message}`);
    return false;
  }
}

async function testAPI() {
  console.log('🧪 QUICK API ENDPOINT TESTING\n');
  console.log('Testing:', BASE_URL);
  console.log('='.repeat(50) + '\n');

  let authToken = '';
  let userId = '';

  // 1. Health Check
  console.log('🏥 HEALTH ENDPOINTS');
  await runTest('GET /health', async () => {
    const response = await fetch(`${BASE_URL}/health`);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    if (data.status !== 'ok') throw new Error('Health check failed');
  });

  await runTest('GET /health/ready', async () => {
    const response = await fetch(`${BASE_URL}/health/ready`);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    if (data.database !== 'connected') throw new Error('DB not connected');
  });

  console.log('');

  // 2. Authentication
  console.log('🔐 AUTHENTICATION ENDPOINTS');
  
  await runTest('POST /auth/register', async () => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `apitest.${Date.now()}@test.com`,
        password: 'TestPass123!',
        role: 'client'
      })
    });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    if (!data.token) throw new Error('No token returned');
    authToken = data.token;
    userId = data.user.id;
  });

  await runTest('POST /auth/login', async () => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testclient1@test.com',
        password: 'TestPass123!'
      })
    });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    if (!data.token) throw new Error('No token returned');
    authToken = data.token;
  });

  await runTest('GET /auth/me', async () => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    if (!data.user) throw new Error('No user data');
  });

  console.log('');

  // 3. Cleaner Search Endpoints
  console.log('🔍 CLEANER SEARCH ENDPOINTS');
  
  await runTest('GET /search/cleaners (browse)', async () => {
    const response = await fetch(`${BASE_URL}/search/cleaners?limit=10`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!response.ok && response.status !== 404) throw new Error(`Status ${response.status}`);
    // May return 404 if no cleaners exist, which is ok for empty database
  });

  console.log('');

  // 4. Jobs Endpoints
  console.log('📅 JOB ENDPOINTS');
  
  await runTest('GET /jobs (list)', async () => {
    const response = await fetch(`${BASE_URL}/jobs`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    // May be 200 or 404 depending on data
    if (response.status !== 200 && response.status !== 404) {
      throw new Error(`Status ${response.status}`);
    }
  });

  console.log('');

  // Print Summary
  printSummary();
}

function printSummary() {
  console.log('='.repeat(50));
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
  console.log(`Avg Response Time: ${avgDuration.toFixed(0)}ms\n`);

  console.log('='.repeat(50));
  if (passRate === '100.0') {
    console.log('🎉 ALL TESTS PASSED!');
  } else {
    console.log('⚠️  SOME TESTS FAILED');
  }
  console.log('='.repeat(50) + '\n');
}

// Run tests
testAPI()
  .then(() => {
    const failed = results.filter(r => r.status === 'FAIL').length;
    process.exit(failed > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });

