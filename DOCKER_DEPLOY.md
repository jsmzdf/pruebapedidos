# 🐳 Despliegue con Docker

## 📦 Archivos Docker Creados

- **Dockerfile** - Imagen de la aplicación
- **docker-compose.yml** - Configuración de despliegue
- **docker-compose.flexible.yml** - Versión con puerto variable
- **.dockerignore** - Archivos a excluir de la imagen
- **deploy.sh** - Script de despliegue automático

---

## 🚀 OPCIÓN 1: Despliegue Rápido (Recomendado)

### 1. Subir archivos al servidor:
```bash
# Desde tu máquina local
scp -r * usuario@ip-servidor:/home/usuario/restaurante/
```

### 2. Dar permisos al script:
```bash
chmod +x deploy.sh
```

### 3. Ejecutar despliegue automático:
```bash
./deploy.sh
```

El script automáticamente:
- ✅ Verifica instalación de Docker
- ✅ Comprueba disponibilidad del puerto
- ✅ Construye la imagen
- ✅ Inicia el contenedor

---

## 🛠️ OPCIÓN 2: Despliegue Manual

### 1. Instalar Docker (si no está instalado):
```bash
# Actualizar sistema
sudo apt-get update

# Instalar Docker
sudo apt-get install -y docker.io docker-compose

# Iniciar servicio Docker
sudo systemctl start docker
sudo systemctl enable docker

# Agregar usuario al grupo docker (opcional, para no usar sudo)
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Construir la imagen:
```bash
docker-compose build
```

### 3. Iniciar la aplicación:
```bash
docker-compose up -d
```

### 4. Verificar que está corriendo:
```bash
docker-compose ps
```

---

## 🔧 Cambiar Puerto

Si el puerto 3001 está ocupado, tienes 2 opciones:

### Opción A: Usar variable de entorno
```bash
PORT=3002 docker-compose up -d
```

### Opción B: Editar docker-compose.yml
```yaml
ports:
  - "3002:3001"  # Cambiar 3001 por el puerto deseado
```

### Opción C: Usar compose flexible
```bash
PORT=3002 docker-compose -f docker-compose.flexible.yml up -d
```

---

## 📝 Comandos Útiles

### Ver logs en tiempo real:
```bash
docker-compose logs -f
```

### Ver logs de las últimas 100 líneas:
```bash
docker-compose logs --tail=100
```

### Detener la aplicación:
```bash
docker-compose down
```

### Reiniciar la aplicación:
```bash
docker-compose restart
```

### Ver estado de contenedores:
```bash
docker-compose ps
```

### Entrar al contenedor:
```bash
docker exec -it sistema-pedidos-restaurante sh
```

### Ver uso de recursos:
```bash
docker stats sistema-pedidos-restaurante
```

### Actualizar la aplicación:
```bash
# Detener contenedor
docker-compose down

# Reconstruir imagen con cambios
docker-compose build

# Iniciar nuevamente
docker-compose up -d
```

---

## 🔍 Verificar que funciona

### Desde el servidor:
```bash
curl http://localhost:3001
```

### Desde tu navegador:
```
http://ip-servidor:3001
```

---

## 🌐 Configurar Firewall (si es necesario)

### Ubuntu/UFW:
```bash
sudo ufw allow 3001/tcp
sudo ufw reload
```

### Verificar reglas:
```bash
sudo ufw status
```

---

## 📊 Estructura de Volúmenes

Los datos se mantienen persistentes en:
```bash
./data/
├── usuarios.json
├── productos.json
└── pedidos.json
```

Estos archivos **NO se pierden** al detener o reiniciar el contenedor.

---

## 🐛 Solución de Problemas

### Error: Puerto en uso
```bash
# Ver qué proceso usa el puerto
sudo lsof -i :3001

# Cambiar puerto en docker-compose.yml o usar variable PORT
```

### Error: Permiso denegado
```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
newgrp docker

# O usar sudo
sudo docker-compose up -d
```

### Contenedor no inicia
```bash
# Ver logs detallados
docker-compose logs

# Verificar imagen
docker images

# Reconstruir desde cero
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Limpiar todo y empezar de nuevo
```bash
# Detener y eliminar contenedor
docker-compose down

# Eliminar imagen
docker rmi sistema-pedidos-restaurante

# Reconstruir
docker-compose build
docker-compose up -d
```

---

## 🔐 Seguridad en Producción

### 1. Configurar usuario no root:
Editar Dockerfile:
```dockerfile
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs
```

### 2. Variables de entorno seguras:
Crear archivo `.env`:
```env
PORT=3001
NODE_ENV=production
SESSION_SECRET=tu-secreto-aqui-cambiar
```

### 3. Usar HTTPS con Nginx:
```bash
# Instalar Nginx
sudo apt-get install nginx

# Configurar proxy reverso (ver configuración en documentación)
```

---

## 📈 Monitoreo

### Ver logs constantemente:
```bash
docker-compose logs -f --tail=50
```

### Ver uso de CPU/Memoria:
```bash
docker stats
```

### Restart automático:
Ya configurado en docker-compose.yml:
```yaml
restart: unless-stopped
```

---

## 🚀 Comandos Resumidos

```bash
# INICIO RÁPIDO
chmod +x deploy.sh
./deploy.sh

# O MANUAL
docker-compose build
docker-compose up -d

# VER ESTADO
docker-compose ps
docker-compose logs -f

# DETENER
docker-compose down

# ACTUALIZAR
docker-compose down && docker-compose build && docker-compose up -d
```

---

## ✅ Ventajas de usar Docker

✅ Mismo entorno en desarrollo y producción  
✅ No preocuparse por dependencias del sistema  
✅ Fácil de escalar y replicar  
✅ Aislamiento de la aplicación  
✅ Rollback rápido si algo falla  
✅ Datos persistentes con volúmenes  

---

## 🎯 Acceso al Sistema

Una vez desplegado:

**URL:** http://ip-servidor:3001

**Usuarios:**
- Mesero: `mesero / mesero123`
- Cocinero: `cocinero / cocinero123`
- Cajero: `cajero / cajero123`

---

**¡Listo para desplegar! 🚀**
