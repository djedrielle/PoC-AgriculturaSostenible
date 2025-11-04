# ======================================================
# Etapa base
# ======================================================
FROM node:20 AS base
WORKDIR /app
COPY package*.json tsconfig.json ./

# ======================================================
# Etapa de desarrollo
# ======================================================
FROM base AS development

# Instala todas las dependencias (incluye devDependencies)
RUN npm install

# Instala globalmente nodemon y ts-node-dev
RUN npm install -g nodemon ts-node-dev

# Copiamos el código fuente
COPY . .

# Exponemos el puerto del backend
EXPOSE 4000

# Comando para iniciar en modo desarrollo (recarga automática)
CMD ["ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]

# ======================================================
# Etapa de construcción (build)
# ======================================================
FROM base AS build
RUN npm install
COPY . .
RUN npm run build  # Compila TypeScript -> JavaScript en /dist

# ======================================================
# Etapa de producción
# ======================================================
FROM node:20-alpine AS production
WORKDIR /app

# Copiamos solo lo necesario
COPY package*.json ./
RUN npm install --only=production

# Copiamos el resultado del build
COPY --from=build /app/dist ./dist

# Exponemos el puerto
EXPOSE 4000

# Comando de ejecución en producción
CMD ["node", "dist/index.js"]
