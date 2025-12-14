import { Router } from 'express';
import {
    createTask,
    getTasksByProject,
    getTaskById,
    deleteTask,
    updateTask
} from '../controllers/task.controller';

import { authenticate } from '../middlewares/auth.middleware';
import { findTask } from '../middlewares/task.middleware';

import { isProjectCreatorOrCollaborator } from '../middlewares/project.middleware';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use('/:projectId', isProjectCreatorOrCollaborator);

/**
 * @swagger
 * /tasks/{projectId}/tasks:
 *   post:
 *     summary: Crear una tarea
 *     description: Crea una tarea asociada al proyecto indicado para el creador o sus colaboradores.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - priority
 *               - assignedTo
 *               - project
 *             properties:
 *               description:
 *                 type: string
 *                 example: Implementar autenticación con JWT
 *               priority:
 *                 type: string
 *                 enum: [baja, media, alta]
 *                 example: media
 *               assignedTo:
 *                 type: string
 *                 example: 64f1c8c2b1d2f7e8a9c0d1e2
 *               project:
 *                 type: string
 *                 example: 64f1c8c2b1d2f7e8a9c0d1e3
 *     responses:
 *       201:
 *         description: Tarea creada correctamente
 *       401:
 *         description: Token faltante o inválido
 *       403:
 *         description: No autorizado para gestionar tareas del proyecto
 *       404:
 *         description: Proyecto no encontrado
 */
router.post('/:projectId/tasks', createTask);

/**
 * @swagger
 * /tasks/{projectId}/tasks:
 *   get:
 *     summary: Listar tareas de un proyecto
 *     description: Obtiene las tareas del proyecto con filtros por estado, prioridad, asignado y opciones de ordenamiento.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del proyecto
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendiente, "en progreso", completada]
 *         description: Filtra las tareas por estado
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [baja, media, alta]
 *         description: Filtra las tareas por prioridad
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *         description: ID del usuario asignado
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Campos de ordenamiento separados por coma. Ejemplo `-createdAt` o `priority:asc,description:desc`
 *     responses:
 *       200:
 *         description: Listado de tareas obtenido correctamente
 *       401:
 *         description: Token faltante o inválido
 *       403:
 *         description: No autorizado para gestionar tareas del proyecto
 *       404:
 *         description: Proyecto no encontrado
 */
router.get('/:projectId/tasks', getTasksByProject);

/**
 * @swagger
 * /tasks/{projectId}/tasks/{taskId}:
 *   get:
 *     summary: Obtener una tarea por ID
 *     description: Retorna la información de una tarea asociada al proyecto.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del proyecto
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador de la tarea
 *     responses:
 *       200:
 *         description: Tarea obtenida correctamente
 *       401:
 *         description: Token faltante o inválido
 *       403:
 *         description: No autorizado para gestionar tareas del proyecto
 *       404:
 *         description: Tarea no encontrada
 */
router.get('/:projectId/tasks/:taskId', findTask, getTaskById);

/**
 * @swagger
 * /tasks/{projectId}/tasks/{taskId}:
 *   put:
 *     summary: Actualizar una tarea
 *     description: Modifica los datos de una tarea existente del proyecto.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del proyecto
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: Ajustar validaciones de entrada
 *               status:
 *                 type: string
 *                 enum: [pendiente, "en progreso", completada]
 *                 example: en progreso
 *               priority:
 *                 type: string
 *                 enum: [baja, media, alta]
 *                 example: alta
 *               assignedTo:
 *                 type: string
 *                 example: 64f1c8c2b1d2f7e8a9c0d1e2
 *     responses:
 *       200:
 *         description: Tarea actualizada correctamente
 *       401:
 *         description: Token faltante o inválido
 *       403:
 *         description: No autorizado para gestionar tareas del proyecto
 *       404:
 *         description: Tarea no encontrada
 */
router.put('/:projectId/tasks/:taskId', findTask, updateTask);

/**
 * @swagger
 * /tasks/{projectId}/tasks/{taskId}:
 *   delete:
 *     summary: Eliminar una tarea
 *     description: Borra una tarea asociada al proyecto indicado.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del proyecto
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador de la tarea
 *     responses:
 *       200:
 *         description: Tarea eliminada correctamente
 *       401:
 *         description: Token faltante o inválido
 *       403:
 *         description: No autorizado para gestionar tareas del proyecto
 *       404:
 *         description: Tarea no encontrada
 */
router.delete('/:projectId/tasks/:taskId', findTask, deleteTask);

export default router;
