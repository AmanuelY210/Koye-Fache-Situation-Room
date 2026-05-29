@echo off
setlocal enabledelayedexpansion
echo ========================================
echo  Koye Fache Prosperity Party
echo  Live Electors Count - Build Deploy Package
echo ========================================
echo.
set "ROOT=%~dp0"

:: Check for MySQL connection
echo Checking database connection...
cd /d "%ROOT%backend"
"C:\tools\mysql\current\bin\mysql.exe" -u root -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MySQL not found/connected. Ensure DB is running.
    echo You will need to import schema.sql manually on cPanel.
    echo.
) else (
    echo MySQL connected. Importing schema...
    "C:\tools\mysql\current\bin\mysql.exe" -u root < "%ROOT%backend\config\schema.sql"
    if %errorlevel% neq 0 (
        echo Schema import failed (may already exist - OK).
    ) else (
        echo Schema imported successfully.
    )
)

:: Build frontend
echo.
echo Building React frontend for production...
cd /d "%ROOT%frontend"
call npx react-scripts build 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Frontend build failed!
    echo Make sure dependencies are installed (run setup.bat first).
    pause
    exit /b 1
)
echo Frontend build complete.

:: Create deployment folder
echo.
echo Creating deployment package...
cd /d "%ROOT%"
if exist "deploy" rmdir /s /q "deploy"
mkdir deploy\backend\config 2>nul
mkdir deploy\backend\controllers 2>nul
mkdir deploy\backend\middleware 2>nul
mkdir deploy\backend\routes 2>nul
mkdir deploy\backend\uploads 2>nul
mkdir deploy\frontend 2>nul

:: Copy backend files
echo Copying backend...
copy "%ROOT%backend\server.js" deploy\backend\ >nul
copy "%ROOT%backend\package.json" deploy\backend\ >nul
copy "%ROOT%backend\.env.example" deploy\backend\.env >nul
copy "%ROOT%backend\config\database.js" deploy\backend\config\ >nul
copy "%ROOT%backend\config\schema.sql" deploy\backend\config\ >nul
copy "%ROOT%backend\config\seed.js" deploy\backend\config\ >nul
copy "%ROOT%backend\controllers\*.js" deploy\backend\controllers\ >nul
copy "%ROOT%backend\middleware\*.js" deploy\backend\middleware\ >nul
copy "%ROOT%backend\routes\*.js" deploy\backend\routes\ >nul
echo. > deploy\backend\uploads\.gitkeep

:: Copy frontend build
echo Copying frontend build...
xcopy /e /q /y "%ROOT%frontend\build\*" deploy\frontend\ >nul

:: Copy documentation
echo Copying deployment guide...
copy "%ROOT%DEPLOY_CPANEL.md" deploy\ >nul

:: Create zip
echo.
echo Creating deploy.zip...
if exist deploy.zip del /q deploy.zip
powershell -Command "Compress-Archive -Path '%ROOT%deploy\*' -DestinationPath '%ROOT%deploy.zip' -Force"
if %errorlevel% equ 0 (
    echo deploy.zip created (%ROOT%deploy.zip^)
) else (
    echo Zip creation failed - deploy folder is still available.
)

echo.
echo ========================================
echo  Deployment package created!
echo.
echo  Package: deploy.zip
echo  Folder:  deploy\
echo.
echo  Upload deploy.zip to cPanel and follow
echo  the instructions in DEPLOY_CPANEL.md
echo ========================================
echo.
pause
