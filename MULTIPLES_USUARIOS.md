# Soporte para Múltiples Usuarios Simultáneos

## 🎯 Problema Resuelto

Ahora el sistema permite que **múltiples usuarios inicien sesión simultáneamente** desde diferentes dispositivos sin que sus sesiones interfieran entre sí.

## 🔧 Cambios Realizados

### 1. **Sistema de Sesiones Mejorado**
- Se agregó `session-file-store` para persistir las sesiones en archivos
- Cada usuario tiene su propia sesión independiente
- Las sesiones se mantienen durante 24 horas
- Limpieza automática de sesiones expiradas cada hora

### 2. **Configuración de Cookies**
- Cookie única `restaurante.sid` para identificación
- Cookie segura con `httpOnly` habilitado
- Rolling sessions (se renueva automáticamente con cada petición)

## 📋 Usuarios Disponibles

Cada usuario puede iniciar sesión en diferentes dispositivos simultáneamente:

| Usuario    | Contraseña   | Rol       | Acceso                    |
|-----------|-------------|-----------|---------------------------|
| mesero    | mesero123   | mesero    | Tomar pedidos             |
| cocinero  | cocinero123 | cocinero  | Ver y preparar pedidos    |
| cajero    | cajero123   | cajero    | Cobrar pedidos            |

## 🚀 Actualización en el Servidor

Ejecuta los siguientes comandos en el servidor para aplicar los cambios:

```bash
# 1. Ve al directorio del proyecto
cd /ruta/del/proyecto

# 2. Haz pull de los últimos cambios
git pull origin main

# 3. Instala las nuevas dependencias
npm install

# 4. Reinicia el servidor

# Si usas PM2:
pm2 restart all

# Si usas Docker:
docker-compose restart

# Si usas node directamente:
# Detén el proceso actual (Ctrl+C o kill)
# Luego inicia de nuevo:
node server.js
```

## ✅ Verificación

Después de actualizar:

1. **Abre 3 navegadores diferentes** (o 3 ventanas de incógnito)
2. **En cada navegador**, inicia sesión con un usuario diferente:
   - Navegador 1: `mesero / mesero123` → Ve a pedidos.html
   - Navegador 2: `cocinero / cocinero123` → Ve a cocina.html
   - Navegador 3: `cajero / cajero123` → Ve a caja.html

3. **Verifica que todos funcionen simultáneamente**:
   - El mesero puede tomar un pedido
   - El cocinero lo ve aparecer en su pantalla
   - El cajero puede cobrarlo cuando esté listo

## 📁 Nueva Carpeta

El sistema creará una carpeta `sessions/` donde se almacenan las sesiones activas. Esta carpeta:
- Se crea automáticamente al iniciar el servidor
- NO se debe incluir en Git (ya está en .gitignore)
- Se limpia automáticamente de sesiones expiradas

## 🔒 Seguridad

- Cada sesión es única e independiente
- Las cookies son httpOnly (no accesibles desde JavaScript del cliente)
- Las sesiones expiran después de 24 horas de inactividad
- Cada rol solo puede acceder a su interfaz correspondiente

## 🆘 Solución de Problemas

### Si sigue sin funcionar:

1. **Verifica que la carpeta sessions/ se haya creado**:
   ```bash
   ls -la
   # Debe aparecer la carpeta sessions/
   ```

2. **Verifica los permisos de la carpeta**:
   ```bash
   chmod 755 sessions/
   ```

3. **Borra las sesiones antiguas y reinicia**:
   ```bash
   rm -rf sessions/*
   pm2 restart all  # o reinicia como corresponda
   ```

4. **Limpia las cookies del navegador**:
   - Abre las herramientas de desarrollo (F12)
   - Ve a Application → Cookies
   - Elimina todas las cookies del dominio
   - Recarga la página (Ctrl+F5)

5. **Verifica que el puerto esté abierto**:
   ```bash
   netstat -tuln | grep 3021
   ```

## 💡 Notas Importantes

- **Cada dispositivo** tendrá su propia sesión independiente
- **Múltiples personas** pueden usar el mismo rol simultáneamente
- Las sesiones **persisten** incluso si reinicias el servidor
- Si cierras el navegador, la sesión se mantiene activa por 24 horas
