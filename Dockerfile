# Especifica la versión de la sintaxis del Dockerfile a utilizar (mejora la compatibilidad y habilita nuevas características de BuildKit)
# syntax=docker/dockerfile:1

# ==========================================
# ETAPA 1: Construcción (Build Stage)
# ==========================================
# Se utiliza una imagen ligera de Node.js (versión 22 en Alpine Linux) y se le asigna el alias "build"
FROM node:22-alpine AS build

# Establece el directorio de trabajo dentro del contenedor donde se ejecutarán los siguientes comandos
WORKDIR /app

# Copia ÚNICAMENTE los archivos de definición de dependencias (package.json y package-lock.json)
# Hacer esto antes de copiar todo el código permite a Docker aprovechar la caché y no reinstalar paquetes si estos archivos no han cambiado
COPY package*.json ./

# Instala las dependencias de manera limpia
RUN npm install

# Ahora sí, copia el resto del código fuente del proyecto desde tu máquina local al contenedor
COPY . .

# Ejecuta el comando para compilar/empaquetar la aplicación (por la ruta generada, parece ser Angular)
RUN npm run build 


# ==========================================
# ETAPA 2: Producción (Production Stage)
# ==========================================
# Se inicia una nueva etapa con una imagen de Nginx. 
# Usar "nginx-unprivileged" es una excelente práctica de seguridad porque el servidor web NO se ejecuta como usuario administrador (root)
FROM nginxinc/nginx-unprivileged:1.27-alpine

# Copia los archivos estáticos ya compilados desde la etapa anterior (alias "build")
# y los pega en la carpeta donde Nginx sirve los archivos por defecto
COPY --from=build /app/dist/tech-store-web/browser /usr/share/nginx/html

# Copia tu configuración personalizada de Nginx desde tu máquina al contenedor.
# El flag "--chown=nginx:nginx" asegura que el usuario no privilegiado de Nginx tenga los permisos correctos para leer el archivo
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Indica que este contenedor va a escuchar peticiones en el puerto 8080 
# (Es una buena práctica documentarlo, aunque el puerto real se expone en el docker-compose.yml)
EXPOSE 8080