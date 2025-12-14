import { Router } from 'express';
import {
    createProject,
    getProjectById,
    getProjects,
    updateProject,
    deleteProject,
    addCollaborator,
    removeCollaborator
} from '../controllers/project.controller';

import { authenticate } from '../middlewares/auth.middleware';
import {
    isProjectCreator,
    isProjectCreatorOrCollaborator
} from '../middlewares/project.middleware';
import { taskRouterByProject } from './task.routes';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Crear un proyecto
 *     description: Registra un proyecto asociado al usuario autenticado.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Proyecto Backend
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token faltante o inválido
 */
router.post('/', createProject);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Listar proyectos del usuario
 *     description: Retorna los proyectos donde el usuario es creador o colaborador con paginación.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de página (por defecto 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Cantidad de proyectos por página (por defecto 10)
 *     responses:
 *       200:
 *         description: Listado paginado de proyectos
 *       401:
 *         description: Token faltante o inválido
 */
router.get('/', getProjects);

/**
 * @swagger
 * /projects/{projectId}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     description: Retorna el proyecto con sus tareas y colaboradores si el usuario es creador o colaborador.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del proyecto
 *     responses:
 *       200:
 *         description: Proyecto obtenido correctamente
 *       401:
 *         description: Token faltante o inválido
 *       403:
 *         description: No autorizado para acceder al proyecto
 *       404:
 *         description: Proyecto no encontrado
 */
router.get('/:projectId', isProjectCreatorOrCollaborator, getProjectById);

/**
 * @swagger
 * /projects/{projectId}:
 *   put:
 *     summary: Actualizar un proyecto
 *     description: Permite al creador modificar los datos del proyecto.
 *     tags: [Projects]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nuevo nombre del proyecto
 *     responses:
 *       200:
 *         description: Proyecto actualizado correctamente
 *       401:
 *         description: Token faltante o inválido
 *       403:
 *         description: No autorizado para modificar el proyecto
 *       404:
 *         description: Proyecto no encontrado
 */
router.put('/:projectId', isProjectCreator, updateProject);

/**
 * @swagger
 * /projects/{projectId}:
 *   delete:
 *     summary: Eliminar un proyecto
 *     description: Permite al creador eliminar el proyecto y sus relaciones.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del proyecto
 *     responses:
 *       200:
 *         description: Proyecto eliminado correctamente
 *       401:
 *         description: Token faltante o inválido
 *       403:
 *         description: No autorizado para eliminar el proyecto
 *       404:
 *         description: Proyecto no encontrado
 */
router.delete('/:projectId', isProjectCreator, deleteProject);

// Colaboradores

/**
 * @swagger
 * /projects/{projectId}/collaborators:
 *   post:
 *     summary: Agregar un colaborador
 *     description: Permite al creador añadir un usuario como colaborador del proyecto.
 *     tags: [Projects]
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
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: ejemplo@mail.com
 *     responses:
 *       200:
 *         description: Colaborador agregado correctamente
 *       400:
 *         description: El usuario ya es colaborador
 *       401:
 *         description: Token faltante o inválido
 *       403:
 *         description: No autorizado para modificar el proyecto
 *       404:
 *         description: Proyecto no encontrado
 */
router.post('/:projectId/collaborators', isProjectCreator, addCollaborator);

/**
 * @swagger
 * /projects/{projectId}/collaborators:
 *   delete:
 *     summary: Eliminar un colaborador
 *     description: Permite al creador remover un colaborador del proyecto.
 *     tags: [Projects]
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
 *               - collaboratorId
 *             properties:
 *               collaboratorId:
 *                 type: string
 *                 example: 64f1c8c2b1d2f7e8a9c0d1e2
 *     responses:
 *       200:
 *         description: Colaborador eliminado correctamente
 *       401:
 *         description: Token faltante o inválido
 *       403:
 *         description: No autorizado para modificar el proyecto
 *       404:
 *         description: Proyecto no encontrado
 */
router.delete('/:projectId/collaborators', isProjectCreator, removeCollaborator);

// Tareas
router.use('/:projectId/tasks', taskRouterByProject);

export default router;
