# Usar imagen oficial de Node.js LTS
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 3021

# Variables de entorno por defecto
ENV PORT=3021
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
