# 🌱 Agricultura Sostenible - Docker Setup

Este proyecto utiliza Docker Compose para orquestar los servicios de Frontend, Backend y Base de Datos.

## 📋 Requisitos Previos

- Docker Desktop instalado ([Descargar aquí](https://www.docker.com/products/docker-desktop))
- Docker Compose (incluido con Docker Desktop)

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

Copia el archivo de ejemplo y ajusta según tus necesidades:

```bash
copy .env.example .env
```

### 2. Levantar los Servicios

```bash
# Levantar todos los servicios en modo desarrollo
docker-compose up

# O en modo detached (segundo plano)
docker-compose up -d
```

### 3. Acceder a la Aplicación

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:4000
- **PostgreSQL**: localhost:5432

## 🛠️ Comandos Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f database

# Detener los servicios
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra la base de datos)
docker-compose down -v

# Reconstruir las imágenes
docker-compose build

# Reconstruir y levantar
docker-compose up --build

# Ejecutar comandos dentro de un contenedor
docker-compose exec backend npm run test
docker-compose exec frontend npm run build
```

## 🗄️ Base de Datos

El contenedor de PostgreSQL:
- Se inicializa automáticamente con el script `Backend/src/Data/dbScript.sql`
- Los datos persisten en un volumen Docker llamado `postgres_data`
- Para resetear la base de datos: `docker-compose down -v && docker-compose up`
- El Backend se conecta usando la variable `DATABASE_URL` configurada en `.env`

## 📁 Estructura de Servicios

- **frontend**: React + Vite + TypeScript (puerto 8080)
- **backend**: Node.js + Express + TypeScript (puerto 4000)
- **database**: PostgreSQL 15 (puerto 5432)

## 🐛 Troubleshooting

### El frontend no se conecta al backend
- Verifica que `VITE_API_URL` en `.env` apunte a `http://localhost:4000`
- Asegúrate de que CORS esté habilitado en el backend

### Error al iniciar la base de datos
- Verifica que el puerto 5432 no esté en uso
- Elimina el volumen: `docker-compose down -v`

### Cambios en el código no se reflejan
- Para frontend/backend: Docker usa volúmenes para hot-reload
- Si persiste: `docker-compose restart frontend` o `docker-compose restart backend`
