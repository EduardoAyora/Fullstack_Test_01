import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();

// Middleware globales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK' });
});

// Middleware de errores
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({
    message: 'Error interno del servidor'
  });
});

export default app;
