@echo off
echo ===================================
echo    Magic Frog - Startup Script
echo ===================================
echo.

REM Setze Farben für die Konsole
color 0A

echo [INFO] Starte Magic Frog Anwendung...
echo.

REM Prüfe, ob die Backend-Umgebung existiert
if not exist backend\venv (
    echo [INFO] Erstelle virtuelle Python-Umgebung für das Backend...
    cd backend
    python -m venv venv
    cd ..
    
    echo [INFO] Installiere Backend-Abhängigkeiten...
    call backend\venv\Scripts\activate
    pip install -r backend\requirements.txt
    call deactivate
)

REM Prüfe, ob die Frontend-Abhängigkeiten installiert sind
if not exist frontend\node_modules (
    echo [INFO] Installiere Frontend-Abhängigkeiten...
    cd frontend
    call npm install
    cd ..
)

echo [INFO] Starte Backend-Server...
start /min cmd /c "title Magic Frog Backend && cd backend && call venv\Scripts\activate && python main.py"

REM Warte kurz, damit das Backend Zeit hat zu starten
timeout /t 3 /nobreak > nul

echo [INFO] Starte Frontend-Server...
start cmd /c "title Magic Frog Frontend && cd frontend && npm start"

echo.
echo [SUCCESS] Magic Frog wurde gestartet!
echo.
echo Backend läuft auf: http://localhost:8000
echo Frontend läuft auf: http://localhost:3000
echo.
echo Das Backend läuft im Hintergrund. Um es zu beenden, schließe alle Magic Frog Fenster.
echo.
echo Drücke eine beliebige Taste, um dieses Fenster zu schließen...
pause > nul

REM Beende alle laufenden Prozesse beim Schließen des Skripts
taskkill /FI "WINDOWTITLE eq Magic Frog Backend" /F > nul 2>&1
taskkill /FI "WINDOWTITLE eq Magic Frog Frontend" /F > nul 2>&1
