# Script para verificar disponibilidad de puerto
# Verifica si el puerto 3001 está disponible, si no, encuentra el siguiente disponible

param(
    [int]$puertoInicial = 3001,
    [int]$rango = 10
)

function Test-Puerto {
    param([int]$puerto)
    
    try {
        $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $puerto)
        $listener.Start()
        $listener.Stop()
        return $true
    }
    catch {
        return $false
    }
}

function Get-ProcesoEnPuerto {
    param([int]$puerto)
    
    $conexiones = Get-NetTCPConnection -LocalPort $puerto -ErrorAction SilentlyContinue
    if ($conexiones) {
        $proceso = Get-Process -Id $conexiones[0].OwningProcess -ErrorAction SilentlyContinue
        return $proceso.ProcessName
    }
    return $null
}

Write-Host "🔍 Verificando disponibilidad de puertos..." -ForegroundColor Cyan
Write-Host ""

# Verificar puerto inicial
if (Test-Puerto -puerto $puertoInicial) {
    Write-Host "✅ Puerto $puertoInicial está DISPONIBLE" -ForegroundColor Green
    Write-Host "   Puedes usar: http://localhost:$puertoInicial" -ForegroundColor Green
} else {
    $proceso = Get-ProcesoEnPuerto -puerto $puertoInicial
    Write-Host "❌ Puerto $puertoInicial está OCUPADO" -ForegroundColor Red
    if ($proceso) {
        Write-Host "   Usado por: $proceso" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "🔎 Buscando puertos alternativos..." -ForegroundColor Cyan
    
    # Buscar puerto alternativo
    $puertoEncontrado = $false
    for ($i = 1; $i -le $rango; $i++) {
        $puertoAlterno = $puertoInicial + $i
        if (Test-Puerto -puerto $puertoAlterno) {
            Write-Host "✅ Puerto alternativo encontrado: $puertoAlterno" -ForegroundColor Green
            Write-Host "   Puedes usar: http://localhost:$puertoAlterno" -ForegroundColor Green
            $puertoEncontrado = $true
            break
        }
    }
    
    if (-not $puertoEncontrado) {
        Write-Host "⚠️  No se encontró puerto disponible en el rango $puertoInicial-$($puertoInicial + $rango)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📋 Puertos en uso en tu sistema:" -ForegroundColor Cyan
Get-NetTCPConnection -State Listen | 
    Where-Object { $_.LocalPort -ge 3000 -and $_.LocalPort -le 3010 } |
    Select-Object LocalPort, @{Name="Proceso";Expression={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).ProcessName}} |
    Format-Table -AutoSize

Write-Host ""
Write-Host "💡 Para cambiar el puerto en tu aplicación:" -ForegroundColor Yellow
Write-Host "   Edita server.js y cambia: const PORT = 3001;" -ForegroundColor Gray
