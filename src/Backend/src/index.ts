import express from 'express';
//import { connectDB } from './Persistence/clients/db';
import { router as businessRoutes } from './Business/routes';

const app = express();

// Middleware base
app.use(express.json());

// Rutas del negocio
app.use('/api', businessRoutes);

// Iniciar conexión a la base de datos
//connectDB();

// Puerto configurable
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});