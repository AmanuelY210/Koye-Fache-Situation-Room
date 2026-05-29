@echo off
echo ========================================
echo  Koye Fache Prosperity Party
echo  Live Electors Count - Setup Script
echo ========================================
echo.

echo Step 1: Installing backend dependencies...
cd /d "%~dp0backend"
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies.
    pause
    exit /b 1
)
echo Backend dependencies installed successfully.
echo.

echo Step 2: Installing frontend dependencies...
cd /d "%~dp0frontend"
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies.
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully.
echo.

echo Step 3: Database setup...
echo.
echo To setup the database:
echo 1. Open MySQL command line or workbench
echo 2. Run the SQL script at: backend\config\schema.sql
echo.
echo Default admin credentials:
echo   Username: admin
echo   Password: admin123
echo.

echo ========================================
echo  Setup Complete!
echo.
echo  Quick Start:
echo   1. Start servers:     start.bat
echo   2. Open VSCode:       code .
echo   3. Frontend:          http://localhost:3000
echo   4. Backend API:       http://localhost:5000
echo   5. Live Display:      http://localhost:3000/live-display
echo ========================================
echo.
pause
