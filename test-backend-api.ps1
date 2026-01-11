# PureTask Backend API Testing Script
# This script tests all major API endpoints

Write-Host "🧪 PURETASK BACKEND API TESTING" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:4000"
$passed = 0
$failed = 0
$warnings = 0

# Test 1: Health Check
Write-Host "Test 1: Health Check..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    if ($response.status -eq "ok") {
        Write-Host " ✅ PASSED" -ForegroundColor Green
        $passed++
    } else {
        Write-Host " ❌ FAILED" -ForegroundColor Red
        $failed++
    }
} catch {
    Write-Host " ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# Test 2: Database Ready Check
Write-Host "Test 2: Database Connection..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health/ready" -Method GET
    if ($response.status -eq "ready") {
        Write-Host " ✅ PASSED" -ForegroundColor Green
        $passed++
    } else {
        Write-Host " ❌ FAILED" -ForegroundColor Red
        $failed++
    }
} catch {
    Write-Host " ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# Test 3: Register Client
Write-Host "Test 3: Register Client..." -NoNewline
try {
    $body = @{
        email = "apitestclient@test.com"
        password = "TestPass123!"
        role = "client"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $body -ContentType "application/json"
    if ($response.token) {
        Write-Host " ✅ PASSED" -ForegroundColor Green
        $clientToken = $response.token
        $passed++
    } else {
        Write-Host " ❌ FAILED" -ForegroundColor Red
        $failed++
    }
} catch {
    if ($_.Exception.Message -like "*EMAIL_EXISTS*") {
        Write-Host " ⚠️ WARNING - Email exists (expected)" -ForegroundColor Yellow
        $warnings++
    } else {
        Write-Host " ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

# Test 4: Login Client
Write-Host "Test 4: Login Client..." -NoNewline
try {
    $body = @{
        email = "client@test.com"
        password = "TestPass123!"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $body -ContentType "application/json"
    if ($response.token) {
        Write-Host " ✅ PASSED" -ForegroundColor Green
        $clientToken = $response.token
        $clientId = $response.user.id
        $passed++
    } else {
        Write-Host " ❌ FAILED" -ForegroundColor Red
        $failed++
    }
} catch {
    Write-Host " ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# Test 5: Get Current User (Protected Route)
Write-Host "Test 5: Get Current User (Auth Check)..." -NoNewline
try {
    $headers = @{
        Authorization = "Bearer $clientToken"
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method GET -Headers $headers
    if ($response.user.email -eq "client@test.com") {
        Write-Host " ✅ PASSED" -ForegroundColor Green
        $passed++
    } else {
        Write-Host " ❌ FAILED" -ForegroundColor Red
        $failed++
    }
} catch {
    Write-Host " ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# Test 6: Get Cleaners List
Write-Host "Test 6: Get Cleaners List..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/cleaner?limit=5" -Method GET
    if ($response.cleaners) {
        Write-Host " ✅ PASSED ($($response.cleaners.Count) cleaners)" -ForegroundColor Green
        $passed++
    } else {
        Write-Host " ⚠️ WARNING - No cleaners found" -ForegroundColor Yellow
        $warnings++
    }
} catch {
    Write-Host " ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# Test 7: Get Jobs List (Protected)
Write-Host "Test 7: Get Jobs List (Client)..." -NoNewline
try {
    $headers = @{
        Authorization = "Bearer $clientToken"
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/jobs" -Method GET -Headers $headers
    Write-Host " ✅ PASSED" -ForegroundColor Green
    $passed++
} catch {
    if ($_.Exception.Message -like "*404*") {
        Write-Host " ⚠️ WARNING - Endpoint may not exist" -ForegroundColor Yellow
        $warnings++
    } else {
        Write-Host " ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

# Test 8: Register Cleaner
Write-Host "Test 8: Register Cleaner..." -NoNewline
try {
    $body = @{
        email = "apitestcleaner@test.com"
        password = "TestPass123!"
        role = "cleaner"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $body -ContentType "application/json"
    if ($response.token) {
        Write-Host " ✅ PASSED" -ForegroundColor Green
        $cleanerToken = $response.token
        $passed++
    } else {
        Write-Host " ❌ FAILED" -ForegroundColor Red
        $failed++
    }
} catch {
    if ($_.Exception.Message -like "*EMAIL_EXISTS*") {
        Write-Host " ⚠️ WARNING - Email exists (expected)" -ForegroundColor Yellow
        $warnings++
    } else {
        Write-Host " ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

# Test 9: Login Cleaner
Write-Host "Test 9: Login Cleaner..." -NoNewline
try {
    $body = @{
        email = "cleaner@test.com"
        password = "TestPass123!"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $body -ContentType "application/json"
    if ($response.token) {
        Write-Host " ✅ PASSED" -ForegroundColor Green
        $cleanerToken = $response.token
        $passed++
    } else {
        Write-Host " ❌ FAILED" -ForegroundColor Red
        $failed++
    }
} catch {
    Write-Host " ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# Test 10: Invalid Login (Should Fail)
Write-Host "Test 10: Invalid Login (Should Fail)..." -NoNewline
try {
    $body = @{
        email = "nonexistent@test.com"
        password = "WrongPassword"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host " ❌ FAILED - Should have rejected invalid login" -ForegroundColor Red
    $failed++
} catch {
    Write-Host " ✅ PASSED - Correctly rejected invalid credentials" -ForegroundColor Green
    $passed++
}

# Summary
Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "📊 TEST SUMMARY" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✅ Passed:   $passed" -ForegroundColor Green
Write-Host "❌ Failed:   $failed" -ForegroundColor Red
Write-Host "⚠️  Warnings: $warnings" -ForegroundColor Yellow
Write-Host ""

$total = $passed + $failed
$passRate = if ($total -gt 0) { [math]::Round(($passed / $total) * 100, 1) } else { 0 }

Write-Host "Pass Rate: $passRate%" -ForegroundColor Cyan
Write-Host ""

if ($failed -eq 0) {
    Write-Host "ALL TESTS PASSED! Backend is healthy." -ForegroundColor Green
} elseif ($passRate -ge 70) {
    Write-Host "Most tests passed, but some issues found." -ForegroundColor Yellow
} else {
    Write-Host "Multiple failures detected. Check backend logs." -ForegroundColor Red
}

Write-Host ""

