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

const taskRouter = Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Listar tareas con filtros y ordenamiento
 *     description: Retorna las tareas de proyectos donde el usuario es creador o colaborador, permitiendo filtros y ordenamiento.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendiente, "en progreso", completada]
 *         description: Filtrar por estado de la tarea
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [baja, media, alta]
 *         description: Filtrar por prioridad
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *         description: ID del usuario asignado
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: ID del proyecto al que pertenece la tarea
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Campos de ordenamiento separados por coma (ej. `-createdAt` o `priority:asc,createdAt:desc`)
 *     responses:
 *       200:
 *         description: Listado de tareas obtenido correctamente
 *       401:
 *         description: Token faltante o inválido
 */
taskRouter.get('/', authenticate, getTasksByProject);

const taskRouterByProject = Router({ mergeParams: true });

taskRouterByProject.use(authenticate);
taskRouterByProject.use(isProjectCreatorOrCollaborator);

/**
 * @swagger
 * /projects/{projectId}/tasks:
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
taskRouterByProject.post('/', createTask);

/**
 * @swagger
 * /projects/{projectId}/tasks/{taskId}:
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
taskRouterByProject.get('/:taskId', findTask, getTaskById);

/**
 * @swagger
 * /projects/{projectId}/tasks/{taskId}:
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
taskRouterByProject.put('/:taskId', findTask, updateTask);

/**
 * @swagger
 * /projects/{projectId}/tasks/{taskId}:
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
taskRouterByProject.delete('/:taskId', findTask, deleteTask);

export { taskRouter, taskRouterByProject };
