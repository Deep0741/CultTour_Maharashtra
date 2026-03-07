@echo off
echo ========================================
echo CulTour Maharashtra - Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

REM Check if MongoDB is running (optional)
echo Checking MongoDB connection...
echo.

REM Setup Backend
echo ========================================
echo Setting up Backend...
echo ========================================
cd backend

if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed
)

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo [IMPORTANT] Please update .env file with your credentials:
    echo - MongoDB connection string
    echo - JWT secrets
    echo - AWS credentials (optional)
    echo - Razorpay keys (optional)
    echo - OpenAI API key (optional)
    echo.
    pause
)

cd ..

REM Setup Frontend
echo ========================================
echo Setting up Frontend...
echo ========================================
cd frontend

if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo Frontend dependencies already installed
)

if not exist .env (
    echo Creating frontend .env file...
    echo VITE_API_URL=http://localhost:5000/api/v1 > .env
)

cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update backend/.env with your credentials
echo 2. Ensure MongoDB is running
echo 3. Run start.bat to start the application
echo.
pause
