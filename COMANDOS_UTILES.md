# 📝 Comandos Útiles - Referencia Rápida

## 🐳 Docker - Comandos Básicos

```bash
# Iniciar aplicación
docker-compose up -d

# Detener aplicación
docker-compose down

# Reiniciar aplicación
docker-compose restart

# Ver estado
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver últimas 50 líneas de log
docker-compose logs --tail=50

# Construir imagen
docker-compose build

# Reconstruir sin cache
docker-compose build --no-cache

# Actualizar y reiniciar
docker-compose down && docker-compose build && docker-compose up -d
```

---

## 🔍 Verificación y Monitoreo

```bash
# Verificar puerto disponible
lsof -i :3001
# O
netstat -tuln | grep 3001

# Verificar aplicación responde
curl http://localhost:3001

# Ver uso de recursos del contenedor
docker stats sistema-pedidos-restaurante

# Ejecutar script de monitoreo
chmod +x monitor.sh
./monitor.sh

# Entrar al contenedor
docker exec -it sistema-pedidos-restaurante sh
```

---

## 💾 Backup y Restauración

```bash
# Crear backup automático
chmod +x backup.sh
./backup.sh

# Backup manual
cp -r data/ data_backup_$(date +%Y%m%d)/

# Restaurar backup
cp -r data_backup_20240530/* data/

# Limpiar pedidos
echo "[]" > data/pedidos.json
```

---

## 🔧 Gestión de Puertos

```bash
# Ver qué proceso usa un puerto
sudo lsof -i :3001

# Matar proceso en puerto
sudo kill $(lsof -ti :3001)

# Cambiar puerto en docker-compose
nano docker-compose.yml
# Cambiar: "3002:3001"

# Usar puerto alternativo con variable
PORT=3002 docker-compose up -d
```

---

## 🔥 Firewall

```bash
# Abrir puerto (UFW)
sudo ufw allow 3001/tcp
sudo ufw reload
sudo ufw status

# Abrir puerto (iptables)
sudo iptables -A INPUT -p tcp --dport 3001 -j ACCEPT
sudo iptables-save
```

---

## 📦 Transferencia de Archivos

```bash
# Subir archivos con SCP
scp -r * usuario@servidor:/ruta/destino/

# Descargar archivos con SCP
scp usuario@servidor:/ruta/archivo.txt ./

# Sincronizar con rsync
rsync -avz --progress * usuario@servidor:/ruta/destino/
```

---

## 🐛 Solución de Problemas

```bash
# Ver todos los logs
docker-compose logs

# Ver logs de errores
docker-compose logs | grep -i error

# Limpiar y reiniciar
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d

# Ver procesos dentro del contenedor
docker exec -it sistema-pedidos-restaurante ps aux

# Ver variables de entorno del contenedor
docker exec -it sistema-pedidos-restaurante env

# Verificar conectividad de red
docker exec -it sistema-pedidos-restaurante ping google.com
```

---

## 📊 Docker - Comandos Avanzados

```bash
# Ver todas las imágenes
docker images

# Eliminar imagen
docker rmi sistema-pedidos-restaurante

# Ver todos los contenedores (incluso detenidos)
docker ps -a

# Eliminar contenedor
docker rm sistema-pedidos-restaurante

# Limpiar sistema Docker
docker system prune -a

# Ver uso de disco de Docker
docker system df

# Ver logs de Docker daemon
sudo journalctl -u docker
```

---

## 🔄 Git (si usas repositorio)

```bash
# Clonar repositorio
git clone URL_REPOSITORIO
cd nombre-repositorio

# Actualizar código
git pull origin main

# Ver cambios
git status
git diff

# Commit cambios
git add .
git commit -m "Descripción del cambio"
git push origin main
```

---

## 🌐 Nginx (Proxy Reverso)

```bash
# Instalar Nginx
sudo apt-get install nginx

# Editar configuración
sudo nano /etc/nginx/sites-available/restaurante

# Activar sitio
sudo ln -s /etc/nginx/sites-available/restaurante /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 📱 Acceso Remoto

```bash
# Conectar por SSH
ssh usuario@ip-servidor

# Conectar con puerto específico
ssh -p 2222 usuario@ip-servidor

# Copiar clave SSH
ssh-copy-id usuario@ip-servidor

# Túnel SSH (acceder puerto remoto localmente)
ssh -L 3001:localhost:3001 usuario@ip-servidor
```

---

## 🔐 Seguridad

```bash
# Cambiar permisos de archivos
chmod 644 data/*.json
chmod 755 *.sh

# Ver procesos corriendo
ps aux | grep node

# Ver conexiones activas
netstat -tulpn

# Ver usuarios conectados
who
w

# Actualizar sistema
sudo apt-get update
sudo apt-get upgrade
```

---

## 📈 Automatización (Cron)

```bash
# Editar crontab
crontab -e

# Backup automático diario a las 2 AM
0 2 * * * /home/usuario/restaurante/backup.sh

# Monitoreo cada hora
0 * * * * /home/usuario/restaurante/monitor.sh > /tmp/monitor.log

# Reiniciar aplicación cada día a las 4 AM
0 4 * * * cd /home/usuario/restaurante && docker-compose restart
```

---

## 🎯 Scripts Personalizados

```bash
# Despliegue automático
chmod +x deploy.sh
./deploy.sh

# Backup de datos
chmod +x backup.sh
./backup.sh

# Monitoreo del sistema
chmod +x monitor.sh
./monitor.sh

# Verificar puerto
chmod +x verificar-puerto.sh
./verificar-puerto.sh
```

---

## 💡 Atajos Útiles

```bash
# Alias para comandos frecuentes (agregar a ~/.bashrc)
alias dc='docker-compose'
alias dclogs='docker-compose logs -f'
alias dcup='docker-compose up -d'
alias dcdown='docker-compose down'
alias dcps='docker-compose ps'

# Aplicar cambios
source ~/.bashrc

# Usar alias
dc up -d
dclogs
```

---

## 🚨 Comandos de Emergencia

```bash
# Detener TODOS los contenedores
docker stop $(docker ps -aq)

# Eliminar TODOS los contenedores
docker rm $(docker ps -aq)

# Reiniciar Docker
sudo systemctl restart docker

# Reiniciar servidor
sudo reboot

# Apagar servidor
sudo shutdown -h now
```

---

## 📝 Información del Sistema

```bash
# Versiones instaladas
node --version
npm --version
docker --version
docker-compose --version

# Información del sistema
uname -a
lsb_release -a
df -h
free -h
uptime
```

---

**💡 TIP:** Guarda este archivo en tu servidor para referencia rápida:
```bash
nano /home/usuario/comandos-utiles.md
```
