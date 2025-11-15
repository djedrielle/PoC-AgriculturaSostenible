import express from 'express';
//import { connectDB } from './Persistence/clients/db';
import { router as userRoutes } from './Business/Routes/userRoutes';
import { router as tokenizeRoutes } from './Business/Routes/tokenRoutes';
import { router as analyticsRoutes } from './Business/Routes/analyticsRoutes';

const app = express();

// Middleware base
app.use(express.json());

// Rutas del negocio
app.use('/user', userRoutes);
app.use('/tokenize', tokenizeRoutes);
app.use('/analytics', analyticsRoutes);

// Iniciar conexión a la base de datos
//connectDB();

// Puerto configurable
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});