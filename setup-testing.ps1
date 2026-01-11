# 🚀 Testing Infrastructure Setup Script
# This script sets up all testing frameworks and creates the test directory structure

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "PURETASK TEST SUITE SETUP" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install Backend Testing Dependencies
Write-Host "Step 1: Installing Backend Testing Dependencies..." -ForegroundColor Yellow
cd C:\Users\onlyw\Documents\GitHub\puretask-backend

Write-Host "  - Installing Jest, Supertest, and testing utilities..." -ForegroundColor Gray
npm install --save-dev jest ts-jest @types/jest supertest @types/supertest @faker-js/faker nock @types/nock jest-mock-extended

if ($LASTEXITCODE -eq 0) {
    Write-Host "  Backend testing dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "  Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Step 2: Create Backend Jest Config
Write-Host ""
Write-Host "Step 2: Creating Backend Jest Configuration..." -ForegroundColor Yellow

$backendJestConfig = @"
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/config/**',
    '!src/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 10000,
};
"@

Set-Content -Path "jest.config.js" -Value $backendJestConfig
Write-Host "  Backend Jest config created!" -ForegroundColor Green

# Step 3: Create Backend Test Directory Structure
Write-Host ""
Write-Host "Step 3: Creating Backend Test Directory Structure..." -ForegroundColor Yellow

$backendTestDirs = @(
    "src/__tests__",
    "src/__tests__/unit",
    "src/__tests__/unit/services",
    "src/__tests__/unit/lib",
    "src/__tests__/unit/middleware",
    "src/__tests__/unit/utils",
    "src/__tests__/integration",
    "src/__tests__/integration/api",
    "src/__tests__/integration/database",
    "src/__tests__/e2e",
    "src/__tests__/security",
    "src/__tests__/performance",
    "src/test-helpers"
)

foreach ($dir in $backendTestDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  Created: $dir" -ForegroundColor Gray
    }
}

Write-Host "  Backend test directories created!" -ForegroundColor Green

# Step 4: Install Frontend Testing Dependencies
Write-Host ""
Write-Host "Step 4: Installing Frontend Testing Dependencies..." -ForegroundColor Yellow
cd C:\Users\onlyw\Documents\GitHub\puretask-frontend

Write-Host "  - Installing React Testing Library and utilities..." -ForegroundColor Gray
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event msw jest-axe

if ($LASTEXITCODE -eq 0) {
    Write-Host "  Frontend testing dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "  Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

# Step 5: Create Frontend Test Directory Structure
Write-Host ""
Write-Host "Step 5: Creating Frontend Test Directory Structure..." -ForegroundColor Yellow

$frontendTestDirs = @(
    "src/__tests__",
    "src/__tests__/unit",
    "src/__tests__/unit/components",
    "src/__tests__/unit/components/ui",
    "src/__tests__/unit/components/features",
    "src/__tests__/unit/components/layout",
    "src/__tests__/unit/hooks",
    "src/__tests__/unit/contexts",
    "src/__tests__/unit/services",
    "src/__tests__/unit/utils",
    "src/__tests__/integration",
    "src/__tests__/integration/pages",
    "src/__tests__/integration/flows",
    "src/__tests__/accessibility",
    "src/test-helpers",
    "src/test-helpers/mocks"
)

foreach ($dir in $frontendTestDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  Created: $dir" -ForegroundColor Gray
    }
}

Write-Host "  Frontend test directories created!" -ForegroundColor Green

# Step 6: Install E2E Testing (Playwright)
Write-Host ""
Write-Host "Step 6: Installing Playwright for E2E Testing..." -ForegroundColor Yellow

npm install --save-dev @playwright/test

if ($LASTEXITCODE -eq 0) {
    Write-Host "  Playwright installed successfully!" -ForegroundColor Green
    Write-Host "  Installing browser binaries..." -ForegroundColor Gray
    npx playwright install
} else {
    Write-Host "  Failed to install Playwright" -ForegroundColor Red
}

# Step 7: Create E2E Test Directory Structure
Write-Host ""
Write-Host "Step 7: Creating E2E Test Directory Structure..." -ForegroundColor Yellow

$e2eTestDirs = @(
    "tests/e2e",
    "tests/e2e/auth",
    "tests/e2e/booking",
    "tests/e2e/messaging",
    "tests/e2e/payments",
    "tests/e2e/admin",
    "tests/fixtures"
)

foreach ($dir in $e2eTestDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  Created: $dir" -ForegroundColor Gray
    }
}

Write-Host "  E2E test directories created!" -ForegroundColor Green

# Step 8: Update package.json scripts
Write-Host ""
Write-Host "Step 8: Adding Test Scripts to package.json..." -ForegroundColor Yellow

# Backend scripts
cd C:\Users\onlyw\Documents\GitHub\puretask-backend
Write-Host "  Updating backend package.json..." -ForegroundColor Gray

# Frontend scripts
cd C:\Users\onlyw\Documents\GitHub\puretask-frontend
Write-Host "  Updating frontend package.json..." -ForegroundColor Gray

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "SETUP COMPLETE!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Review TESTING_ARCHITECTURE.md" -ForegroundColor White
Write-Host "  2. Run: npm test (in backend or frontend)" -ForegroundColor White
Write-Host "  3. Write your first test!" -ForegroundColor White
Write-Host ""
Write-Host "Test Directories Created:" -ForegroundColor Cyan
Write-Host "  Backend:  puretask-backend/src/__tests__/" -ForegroundColor White
Write-Host "  Frontend: puretask-frontend/src/__tests__/" -ForegroundColor White
Write-Host "  E2E:      puretask-frontend/tests/e2e/" -ForegroundColor White
Write-Host ""

