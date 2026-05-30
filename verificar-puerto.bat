@echo off
REM Script batch para verificar puerto 3001 en Windows

echo.
echo Verificando disponibilidad del puerto 3001...
echo.

netstat -ano | findstr :3001 > nul

if %errorlevel% == 0 (
    echo [X] Puerto 3001 esta OCUPADO
    echo.
    echo Procesos usando el puerto 3001:
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
        tasklist /FI "PID eq %%a" | findstr /V "Image"
    )
    echo.
    echo Puertos alternativos disponibles: 3002, 3003, 3004, etc.
    echo.
    echo Para cambiar el puerto:
    echo   1. Abre server.js
    echo   2. Cambia: const PORT = 3001;
    echo   3. Por ejemplo: const PORT = 3002;
) else (
    echo [OK] Puerto 3001 esta DISPONIBLE
    echo.
    echo Puedes iniciar tu servidor con: npm start
)

echo.
echo Presiona cualquier tecla para salir...
pause > nul
