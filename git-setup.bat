@echo off
echo ========================================
echo  Pushing Koye Fache Party to GitHub
echo ========================================
echo.

:: --- CONFIGURE THESE ---
set "GITHUB_USER=AmanuelY210"
set "REPO_NAME=Koye-Party-Election-"
set "EMAIL=your-email@example.com"
:: ------------------------

echo Setting up Git...
git init
git config user.name "%GITHUB_USER%"
git config user.email "%EMAIL%"

echo Adding files...
git add .
git status

echo.
echo Committing...
git commit -m "Initial commit - Koye Fache Prosperity Party Live Electors Count"

echo.
echo Creating main branch...
git branch -M main

echo.
echo Adding remote origin...
git remote add origin "git@github.com:%GITHUB_USER%/%REPO_NAME%.git"

echo.
echo ========================================
echo  Ready to push!
echo  Run the command below to push to GitHub:
echo.
echo    git push -u origin main
echo.
echo  NOTE: Make sure your SSH key is added
echo  to GitHub before pushing.
echo ========================================
pause
