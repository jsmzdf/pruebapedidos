# 🚀 Guía de Ejecución - Después de Clonar desde Git

## Situación Actual
✅ Código clonado en el servidor Ubuntu desde Git

---

## 📋 OPCIÓN 1: Con Docker (Recomendado)

### Paso 1: Verificar Docker instalado
```bash
docker --version
docker-compose --version
```

**Si NO está instalado:**
```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

### Paso 2: Dar permisos a scripts
```bash
cd /ruta/de/tu/repositorio
chmod +x deploy.sh backup.sh monitor.sh verificar-puerto.sh
```

### Paso 3: Ejecutar despliegue automático
```bash
./deploy.sh
```

**O manualmente:**
```bash
# Construir imagen
docker-compose build

# Iniciar aplicación
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### Paso 4: Verificar
```bash
# Ver estado
docker-compose ps

# Probar aplicación
curl http://localhost:3001
```

---

## 💻 OPCIÓN 2: Sin Docker (Node.js directo)

### Paso 1: Verificar Node.js instalado
```bash
node --version
npm --version
```

**Si NO está instalado:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar
node --version
npm --version
```

### Paso 2: Instalar dependencias
```bash
cd /ruta/de/tu/repositorio
npm install
```

### Paso 3: Iniciar aplicación
```bash
npm start
```

**O en background con nohup:**
```bash
nohup npm start > app.log 2>&1 &
```

**O con PM2 (mejor opción):**
```bash
# Instalar PM2
sudo npm install -g pm2

# Iniciar aplicación
pm2 start server.js --name "restaurante"

# Ver estado
pm2 status

# Ver logs
pm2 logs restaurante

# Detener
pm2 stop restaurante

# Reiniciar
pm2 restart restaurante

# Auto-start en reboot
pm2 startup
pm2 save
```

### Paso 4: Verificar
```bash
curl http://localhost:3001
```

---

## 🔥 Abrir Puerto en Firewall

```bash
# Ubuntu con UFW
sudo ufw allow 3001/tcp
sudo ufw reload
sudo ufw status
```

---

## 🌐 Acceder desde el Navegador

```
http://IP-DEL-SERVIDOR:3001
```

**Usuarios:**
- Mesero: `mesero / mesero123`
- Cocinero: `cocinero / cocinero123`
- Cajero: `cajero / cajero123`

---

## 🔍 Verificar que Funciona

### Desde el servidor:
```bash
curl http://localhost:3001
```

### Ver logs (Docker):
```bash
docker-compose logs -f
```

### Ver logs (Node.js directo):
```bash
# Con nohup
tail -f app.log

# Con PM2
pm2 logs
```

---

## ⚙️ Si el Puerto 3001 está Ocupado

### Verificar:
```bash
./verificar-puerto.sh
# O
lsof -i :3001
```

### Cambiar puerto:

**Con Docker:**
```bash
# Editar docker-compose.yml
nano docker-compose.yml
# Cambiar: "3002:3001"

# Reiniciar
docker-compose down
docker-compose up -d
```

**Con Node.js:**
```bash
# Editar server.js
nano server.js
# Cambiar: const PORT = 3002;

# Reiniciar
pm2 restart restaurante
```

---

## 🛠️ Comandos Útiles

### Docker:
```bash
docker-compose ps              # Estado
docker-compose logs -f         # Logs en tiempo real
docker-compose restart         # Reiniciar
docker-compose down            # Detener
docker-compose up -d           # Iniciar
```

### PM2:
```bash
pm2 list                       # Listar apps
pm2 logs restaurante           # Ver logs
pm2 restart restaurante        # Reiniciar
pm2 stop restaurante           # Detener
pm2 delete restaurante         # Eliminar
pm2 monit                      # Monitor en vivo
```

---

## 🆘 Solución de Problemas

### "Puerto ocupado"
```bash
sudo lsof -i :3001
sudo kill $(lsof -ti :3001)
```

### "Permission denied"
```bash
sudo chmod +x *.sh
```

### "npm: command not found"
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### "Docker daemon not running"
```bash
sudo systemctl start docker
sudo systemctl status docker
```

---

## ✅ Resumen de Comandos Rápidos

```bash
# OPCIÓN DOCKER (más simple)
cd /ruta/repositorio
chmod +x deploy.sh
./deploy.sh

# OPCIÓN NODE.JS + PM2 (alternativa)
cd /ruta/repositorio
npm install
sudo npm install -g pm2
pm2 start server.js --name restaurante
pm2 save
pm2 startup

# Abrir puerto
sudo ufw allow 3001/tcp
sudo ufw reload

# Verificar
curl http://localhost:3001
```

---

## 🎯 Acceso Final

**URL:** http://IP-SERVIDOR:3001

**Credenciales:**
- `mesero / mesero123`
- `cocinero / cocinero123`
- `cajero / cajero123`

---

**¡Listo! 🎉**
