import { Router } from 'express';
import { getUserStats } from '../controllers/stats.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Obtener estadísticas del usuario
 *     description: Retorna métricas agregadas del usuario autenticado tales como totales de proyectos, tareas y desglose por estado y prioridad.
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente
 *       401:
 *         description: Token faltante o inválido
 */
router.get('/', getUserStats);

export default router;
