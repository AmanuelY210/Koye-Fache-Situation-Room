@echo off
echo ========================================
echo  Koye Fache Prosperity Party
echo  Live Electors Count Management System
echo  Starting Development Servers...
echo ========================================
echo.

set "BACKEND_DIR=%~dp0backend"
set "FRONTEND_DIR=%~dp0frontend"

echo [1/2] Starting Backend API Server (Port 5000)...
start "Backend API" cmd /c "cd /d ""%BACKEND_DIR%"" ^&^& node server.js"

echo [2/2] Starting Frontend Dev Server (Port 3000)...
start "Frontend" cmd /c "cd /d ""%FRONTEND_DIR%"" ^&^& npx react-scripts start"

echo.
echo ========================================
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:5000
echo  Live Display: http://localhost:3000/live-display
echo.
echo  Admin Login:
echo    Username: admin
echo    Password: admin123
echo ========================================
echo.
echo Press any key to stop both servers (close windows manually)...
pause >nul
