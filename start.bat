@echo off
echo Starting Birthday Wishlist App...
echo.
echo Backend: http://localhost:3001
echo Guests:  http://localhost:3000
echo Admin:   http://localhost:3002
echo.
start "Backend" cmd /k "cd /d D:\birthday-wishlist\backend && npm run dev"
timeout /t 2
start "Frontend" cmd /k "cd /d D:\birthday-wishlist\frontend && npm run dev"
timeout /t 2
start "Admin" cmd /k "cd /d D:\birthday-wishlist\admin && npm run dev"
echo.
echo All servers started! Check the opened windows.
pause
