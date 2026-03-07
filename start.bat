@echo off
echo ========================================
echo Starting CulTour Maharashtra
echo ========================================
echo.

REM Start Backend
echo Starting Backend Server...
start "CulTour Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

REM Start Frontend
echo Starting Frontend Server...
start "CulTour Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Application Started!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to stop all servers...
pause >nul

REM Kill processes
taskkill /FI "WindowTitle eq CulTour Backend*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq CulTour Frontend*" /T /F >nul 2>&1

echo.
echo All servers stopped.
pause
