# 🐧 Scripts para Servidor Ubuntu/Linux

## Scripts Creados

### 1. `verificar-puerto.sh` (Completo)
Script detallado con todas las funcionalidades.

### 2. `check-port.sh` (Simple)
Script rápido y sencillo.

## 📝 Instrucciones de Uso

### En tu servidor Ubuntu:

1. **Subir los archivos al servidor:**
```bash
# Opción 1: Usando SCP desde tu máquina local
scp verificar-puerto.sh usuario@servidor:/ruta/proyecto/
scp check-port.sh usuario@servidor:/ruta/proyecto/

# Opción 2: Crear el archivo directamente en el servidor
nano verificar-puerto.sh
# (pegar el contenido y guardar con Ctrl+X, Y, Enter)
```

2. **Dar permisos de ejecución:**
```bash
chmod +x verificar-puerto.sh
chmod +x check-port.sh
```

3. **Ejecutar el script:**

**Opción A - Script completo:**
```bash
./verificar-puerto.sh
```

O para verificar otro puerto:
```bash
./verificar-puerto.sh 3002
```

**Opción B - Script simple:**
```bash
bash check-port.sh
```

## 🔧 Comandos Útiles en Ubuntu

### Verificar puerto manualmente:
```bash
# Ver si el puerto 3001 está en uso
lsof -i :3001

# O con netstat
netstat -tuln | grep 3001

# O con ss
ss -tuln | grep 3001
```

### Ver qué proceso usa el puerto:
```bash
lsof -i :3001
```

### Matar proceso en un puerto:
```bash
# Obtener el PID
lsof -ti :3001

# Matar el proceso
kill $(lsof -ti :3001)

# O forzar
kill -9 $(lsof -ti :3001)
```

### Ver todos los puertos en uso:
```bash
netstat -tuln
```

## 🚀 Cambiar Puerto en la Aplicación

Si necesitas usar otro puerto (ejemplo: 3002):

1. **Editar server.js:**
```bash
nano server.js
```

2. **Cambiar la línea:**
```javascript
const PORT = 3001;  // cambiar a 3002 o el que esté disponible
```

3. **Guardar y reiniciar:**
```bash
# Ctrl+X, Y, Enter para guardar en nano

# Reiniciar la aplicación
npm start
```

## 🔍 Dependencias Necesarias

El script usa estos comandos (generalmente ya instalados en Ubuntu):
- `lsof` - Ver archivos abiertos y puertos
- `netstat` - Estadísticas de red
- `nc` (netcat) - Verificar conexiones

Si falta alguno:
```bash
sudo apt-get update
sudo apt-get install lsof net-tools netcat
```

## 📋 Ejemplo de Salida

```
🔍 Verificando disponibilidad del puerto 3001...

✅ Puerto 3001 está DISPONIBLE
   Puedes usar: http://localhost:3001

📋 Puertos Node.js en uso:
   No hay procesos Node.js ejecutándose

💡 Para cambiar el puerto en tu aplicación:
   Edita server.js y cambia: const PORT = 3001;
   Por ejemplo: const PORT = 3002;
```

## ⚡ Método Rápido (Sin Scripts)

Comando único para verificar puerto:
```bash
lsof -i :3001 && echo "Puerto OCUPADO" || echo "Puerto DISPONIBLE"
```

## 🔐 Nota sobre Permisos

Para ver algunos procesos necesitas permisos de root:
```bash
sudo ./verificar-puerto.sh
```

O:
```bash
sudo lsof -i :3001
```
