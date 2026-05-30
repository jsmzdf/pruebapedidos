# 🚀 Guía Rápida: Desplegar en Servidor Ubuntu

## 📤 Paso 1: Transferir Archivos al Servidor

### Opción A: Usando SCP (Recomendado)
```bash
# Desde tu máquina Windows (PowerShell o Git Bash)
cd "d:\trabajo Joseluis"

# Transferir todo el proyecto
scp -r * usuario@ip-servidor:/home/usuario/restaurante/

# O transferir archivos específicos
scp -r data/ public/ routes/ middleware/ *.js *.json *.yml Dockerfile deploy.sh usuario@ip-servidor:/home/usuario/restaurante/
```

### Opción B: Usando Git
```bash
# En tu servidor Ubuntu
git clone URL_DEL_REPOSITORIO
cd nombre-repositorio
```

### Opción C: Usando SFTP (FileZilla, WinSCP)
1. Conectar al servidor con cliente SFTP
2. Arrastrar carpeta completa al servidor

---

## 🐳 Paso 2: Instalar Docker en Ubuntu

```bash
# Conectar al servidor
ssh usuario@ip-servidor

# Actualizar sistema
sudo apt-get update

# Instalar Docker
sudo apt-get install -y docker.io docker-compose

# Iniciar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Verificar instalación
docker --version
docker-compose --version
```

---

## 🚀 Paso 3: Desplegar la Aplicación

### Método Automático (MÁS FÁCIL):
```bash
cd /home/usuario/restaurante
chmod +x deploy.sh
./deploy.sh
```

### Método Manual:
```bash
cd /home/usuario/restaurante

# Construir imagen
docker-compose build

# Iniciar contenedor
docker-compose up -d

# Ver logs
docker-compose logs -f
```

---

## ✅ Paso 4: Verificar que Funciona

```bash
# Desde el servidor
curl http://localhost:3001

# Desde tu navegador
http://IP-DEL-SERVIDOR:3001
```

---

## 🔥 Abrir Puerto en Firewall (si es necesario)

```bash
# Ubuntu con UFW
sudo ufw allow 3001/tcp
sudo ufw reload
sudo ufw status

# O usar iptables
sudo iptables -A INPUT -p tcp --dport 3001 -j ACCEPT
sudo iptables-save
```

---

## 📝 Comandos Útiles

```bash
# Ver estado del contenedor
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Detener aplicación
docker-compose down

# Reiniciar aplicación
docker-compose restart

# Actualizar código y reiniciar
docker-compose down
docker-compose build
docker-compose up -d
```

---

## 🔧 Cambiar Puerto (si 3001 está ocupado)

### Opción 1: Variable de entorno
```bash
PORT=3002 docker-compose up -d
```

### Opción 2: Editar docker-compose.yml
```yaml
ports:
  - "3002:3001"  # Cambiar primer número
```

---

## 🌐 Configurar Dominio (Opcional)

### Con Nginx como proxy reverso:

```bash
# Instalar Nginx
sudo apt-get install nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/restaurante
```

Contenido del archivo:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activar sitio
sudo ln -s /etc/nginx/sites-available/restaurante /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

---

## 📋 Checklist Completo

- [ ] Archivos transferidos al servidor
- [ ] Docker instalado
- [ ] Imagen construida (`docker-compose build`)
- [ ] Contenedor corriendo (`docker-compose up -d`)
- [ ] Puerto abierto en firewall
- [ ] Aplicación accesible desde navegador
- [ ] Usuarios de prueba funcionando

---

## 🆘 Solución de Problemas Comunes

### "Puerto 3001 ocupado"
```bash
# Ver qué usa el puerto
sudo lsof -i :3001

# Usar puerto alternativo
PORT=3002 docker-compose up -d
```

### "Permission denied"
```bash
# Agregar usuario a grupo docker
sudo usermod -aG docker $USER
newgrp docker

# O usar sudo
sudo docker-compose up -d
```

### "Cannot connect to Docker daemon"
```bash
# Iniciar Docker
sudo systemctl start docker

# Verificar estado
sudo systemctl status docker
```

### "Contenedor no responde"
```bash
# Ver logs
docker-compose logs

# Reiniciar
docker-compose restart

# Rebuild completo
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 🎯 URLs y Credenciales

**URL:** http://IP-SERVIDOR:3001

**Usuarios:**
| Rol | Usuario | Contraseña |
|-----|---------|------------|
| Mesero | `mesero` | `mesero123` |
| Cocinero | `cocinero` | `cocinero123` |
| Cajero | `cajero` | `cajero123` |

---

## ⚡ Comandos en Secuencia (Copiar y Pegar)

```bash
# DESPLIEGUE COMPLETO EN UN SOLO BLOQUE

cd /home/usuario/restaurante
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
newgrp docker
docker-compose build
docker-compose up -d
docker-compose ps
echo "✅ ¡Aplicación desplegada en http://localhost:3001!"
```

---

**¡Listo para producción! 🚀**
