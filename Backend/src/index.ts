import express from 'express';
import cors from 'cors';

import { router as analyticsRoutes } from './Business/Routes/analyticsRoutes';
import { router as marketRoutes } from './Business/Routes/marketRoutes';
import { router as validationRoutes } from './Business/Routes/processValidationRoutes';
import { router as tokenRoutes } from './Business/Routes/tokenRoutes';
import { router as userRoutes } from './Business/Routes/userRoutes';
import { router as walletRoutes } from './Business/Routes/walletRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// logger
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.path}`, req.body);
  next();
});

// Middleware base
app.use(express.json());

// Rutas del negocio
app.use('/analytics', analyticsRoutes);
app.use('/market', marketRoutes);
app.use('/validation', validationRoutes);
app.use('/token', tokenRoutes);
app.use('/user', userRoutes);
app.use('/wallet', walletRoutes);


export { app };

// Iniciar conexión a la base de datos
//connectDB();

// Puerto configurable
const PORT = process.env.PORT || 4000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
  });
}