@echo off
echo =============================================
echo   PURETASK FRONTEND - CLEAN START
echo =============================================
echo.

cd C:\Users\onlyw\Documents\GitHub\puretask-frontend

echo [1/3] Stopping any running servers...
taskkill /F /IM node.exe 2>nul

echo [2/3] Clearing cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo [3/3] Starting dev server...
echo.
echo Your app will be at: http://localhost:3001
echo.
npm run dev

pause
