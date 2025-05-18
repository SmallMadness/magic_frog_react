@echo off
echo ===================================
echo    Magic Frog - Database Reset
echo ===================================
echo.

REM Setze Farben für die Konsole
color 0C

echo [WARNING] Dieses Skript löscht die Datenbank und erstellt sie neu!
echo Alle Daten gehen verloren!
echo.
echo Drücke STRG+C, um abzubrechen, oder...
pause

echo.
echo [INFO] Stoppe laufende Server...
taskkill /FI "WINDOWTITLE eq Magic Frog Backend" /F > nul 2>&1
taskkill /FI "WINDOWTITLE eq Magic Frog Frontend" /F > nul 2>&1

echo.
echo [INFO] Lösche Datenbank...
if exist backend\magic_cards.db del /f backend\magic_cards.db

echo [INFO] Lösche Synchronisierungsdatei...
if exist backend\last_sync.txt del /f backend\last_sync.txt

echo.
echo [SUCCESS] Datenbank wurde zurückgesetzt!
echo.
echo [INFO] Starte die Anwendung neu...
echo.

REM Starte das normale Startskript
call start.bat

echo.
echo [INFO] Fertig! Die Anwendung wurde mit einer neuen Datenbank gestartet.
echo.
