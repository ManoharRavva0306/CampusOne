@echo off
title CampusOne CMRS - Genesis'26
echo ======================================================================
echo           🏛️ CampusOne - Unified Campus Service & e-Governance
echo                      Genesis'26 Hackathon Prototype
echo ======================================================================
echo.
echo Starting Backend API Server (Port 5000)...
start "CampusOne Backend (Port 5000)" cmd /k "cd /d %~dp0backend && npm start"

echo Starting Frontend Dev Server (Port 3000)...
start "CampusOne Frontend (Port 3000)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ======================================================================
echo [SUCCESS] Both servers launched!
echo.
echo 🌐 Frontend UI : http://localhost:3000
echo ⚙️ Backend API : http://localhost:5000/api/health
echo ======================================================================
echo.
timeout /t 3 >nul
start http://localhost:3000
