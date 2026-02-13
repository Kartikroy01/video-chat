@echo off
echo ==========================================
echo   Starting StudentConnect Project
echo ==========================================

echo.
echo [1/2] Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm run dev"
cd ..

echo.
echo [2/2] Starting Frontend Client...
cd frontend
start "Frontend Client" cmd /k "npm run dev"
cd ..

echo.
echo ==========================================
echo   Both services are launching in new windows.
echo   You can minimize this window or close it.
echo ==========================================
pause
