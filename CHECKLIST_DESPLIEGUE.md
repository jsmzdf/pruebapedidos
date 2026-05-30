# ✅ CHECKLIST DE DESPLIEGUE

## 📋 Lista de Verificación para Desplegar en Servidor Ubuntu

### Fase 1: Preparación (En tu máquina Windows)
- [x] Proyecto desarrollado y funcionando localmente
- [x] Archivos Docker creados (Dockerfile, docker-compose.yml)
- [x] Scripts de despliegue creados (deploy.sh, backup.sh, monitor.sh)
- [x] Documentación completa generada
- [ ] Archivos comprimidos o listos para transferir

---

### Fase 2: Servidor Ubuntu - Requisitos Previos
- [ ] Acceso SSH al servidor (usuario@ip-servidor)
- [ ] Docker instalado en el servidor
- [ ] Docker Compose instalado
- [ ] Puerto 3001 disponible (o alternativo identificado)
- [ ] Firewall configurado para permitir el puerto

**Comandos para verificar:**
```bash
# Conectar al servidor
ssh usuario@ip-servidor

# Verificar Docker
docker --version
docker-compose --version

# Si no está instalado:
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

---

### Fase 3: Transferencia de Archivos
- [ ] Archivos transferidos al servidor

**Opciones:**

**A. Con SCP (Recomendado):**
```bash
scp -r d:\trabajo Joseluis\* usuario@servidor:/home/usuario/restaurante/
```

**B. Con Git:**
```bash
git push origin main
# En el servidor:
git clone URL_REPOSITORIO
```

**C. Con SFTP (FileZilla/WinSCP):**
- [ ] Cliente SFTP configurado
- [ ] Conexión establecida
- [ ] Archivos transferidos

---

### Fase 4: Configuración en el Servidor
```bash
# Conectar al servidor
ssh usuario@servidor

# Navegar al directorio
cd /home/usuario/restaurante

# Verificar archivos
ls -la

# Dar permisos a scripts
chmod +x deploy.sh
chmod +x backup.sh
chmod +x monitor.sh
chmod +x verificar-puerto.sh
chmod +x check-port.sh
```

**Checklist:**
- [ ] Todos los archivos presentes
- [ ] Scripts con permisos de ejecución
- [ ] Carpeta `data/` con archivos JSON

---

### Fase 5: Despliegue
- [ ] Ejecutar script de despliegue

```bash
./deploy.sh
```

**El script debe:**
- [ ] Verificar que Docker está instalado
- [ ] Comprobar puerto disponible
- [ ] Construir imagen Docker
- [ ] Iniciar contenedor
- [ ] Mostrar mensaje de éxito

---

### Fase 6: Verificación
- [ ] Contenedor corriendo

```bash
docker-compose ps
```

- [ ] Aplicación responde

```bash
curl http://localhost:3001
```

- [ ] Logs sin errores

```bash
docker-compose logs --tail=50
```

- [ ] Puerto accesible externamente

```bash
# Desde tu navegador:
http://IP-SERVIDOR:3001
```

---

### Fase 7: Configuración de Firewall
- [ ] Puerto abierto en firewall

```bash
sudo ufw allow 3001/tcp
sudo ufw reload
sudo ufw status
```

- [ ] Verificar acceso desde Internet

```bash
# En tu navegador local:
http://IP-SERVIDOR:3001
```

---

### Fase 8: Pruebas Funcionales
- [ ] Página de login carga correctamente
- [ ] Login con usuario `mesero` funciona
- [ ] Login con usuario `cocinero` funciona
- [ ] Login con usuario `cajero` funciona

**Flujo completo:**
- [ ] Mesero puede crear pedido
- [ ] Pedido aparece en cocina automáticamente
- [ ] Cocinero puede marcar "Entregado a Mesa"
- [ ] Pedido aparece en caja
- [ ] Cajero puede marcar "Cobrado/Facturado"
- [ ] Estados de pedidos se actualizan correctamente

---

### Fase 9: Configuración de Producción (Opcional)
- [ ] Variables de entorno configuradas

```bash
cp .env.example .env
nano .env
# Cambiar SESSION_SECRET
```

- [ ] Backup automático configurado

```bash
# Agregar a crontab
crontab -e
# Agregar: 0 2 * * * /home/usuario/restaurante/backup.sh
```

- [ ] Monitoreo configurado

```bash
# Probar monitoreo
./monitor.sh
```

- [ ] Nginx configurado (si se usa proxy reverso)
- [ ] Certificado SSL instalado (si se usa HTTPS)

---

### Fase 10: Documentación y Entrega
- [ ] README.md revisado
- [ ] Credenciales de acceso documentadas
- [ ] URL de acceso documentada
- [ ] Instrucciones de mantenimiento entregadas

---

## 🎯 Criterios de Éxito

### ✅ Deployment Exitoso si:
1. ✅ Contenedor Docker corriendo sin errores
2. ✅ Aplicación accesible desde navegador
3. ✅ Los 3 roles pueden iniciar sesión
4. ✅ Se pueden crear y gestionar pedidos
5. ✅ Datos persisten al reiniciar contenedor
6. ✅ Logs accesibles y sin errores críticos

---

## 🆘 Problemas Comunes y Soluciones

### ❌ "Puerto 3001 ocupado"
**Solución:**
```bash
# Verificar qué usa el puerto
sudo lsof -i :3001

# Usar puerto alternativo
PORT=3002 docker-compose up -d
```

---

### ❌ "Permission denied" al ejecutar scripts
**Solución:**
```bash
chmod +x *.sh
# O usar sudo
sudo ./deploy.sh
```

---

### ❌ "Docker daemon not running"
**Solución:**
```bash
sudo systemctl start docker
sudo systemctl status docker
```

---

### ❌ Contenedor se detiene inmediatamente
**Solución:**
```bash
# Ver logs para identificar error
docker-compose logs

# Rebuild sin cache
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

### ❌ No se puede acceder desde navegador
**Solución:**
```bash
# Verificar firewall
sudo ufw status
sudo ufw allow 3001/tcp

# Verificar que el contenedor está escuchando en 0.0.0.0
docker-compose logs | grep listening
```

---

## 📞 Comandos de Diagnóstico

Si algo falla, ejecutar estos comandos y revisar la salida:

```bash
# 1. Estado de Docker
docker --version
docker-compose --version
systemctl status docker

# 2. Estado del contenedor
docker-compose ps
docker-compose logs --tail=100

# 3. Recursos del sistema
df -h
free -h
docker stats --no-stream

# 4. Red y puertos
netstat -tuln | grep 3001
curl -v http://localhost:3001

# 5. Archivos de datos
ls -lah data/
cat data/pedidos.json
```

---

## 📊 Tiempos Estimados

- Preparación (Fase 1-2): 10 minutos
- Transferencia (Fase 3): 5 minutos
- Configuración (Fase 4): 5 minutos
- Despliegue (Fase 5): 5-10 minutos
- Verificación (Fase 6-8): 10 minutos

**Total estimado: 35-45 minutos**

---

## 🎉 Deployment Completado

Una vez todas las casillas marcadas:

**Tu aplicación está:**
- ✅ Desplegada en producción
- ✅ Accesible desde Internet
- ✅ Con datos persistentes
- ✅ Con backup configurado
- ✅ Lista para usar

**URL de acceso:** http://IP-SERVIDOR:3001

**Credenciales:**
- Mesero: `mesero / mesero123`
- Cocinero: `cocinero / cocinero123`
- Cajero: `cajero / cajero123`

---

**¡FELICITACIONES! 🎊 Sistema desplegado exitosamente! 🚀**
