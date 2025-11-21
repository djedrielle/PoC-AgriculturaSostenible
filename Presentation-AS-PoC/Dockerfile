## ======================================================
# Etapa base
# ======================================================
FROM node:20 AS base
WORKDIR /app
COPY package*.json ./

# ======================================================
# Etapa de desarrollo
# ======================================================
FROM base AS development

# Instala todas las dependencias
RUN npm install

# Copia el código fuente
COPY . .

# Expone el puerto 8080
EXPOSE 8080

# Comando para desarrollo con hot-reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ======================================================
# Etapa de construcción
# ======================================================
FROM base AS build
RUN npm install
COPY . .
RUN npm run build

# ======================================================
# Etapa de producción con nginx
# ======================================================
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]