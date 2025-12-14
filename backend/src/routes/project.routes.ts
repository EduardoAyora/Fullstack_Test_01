import { Router } from 'express';
import {
    createProject,
    getProjects,
    updateProject,
    deleteProject,
    addCollaborator,
    removeCollaborator
} from '../controllers/project.controller';

import { authenticate } from '../middlewares/auth.middleware';
import { isProjectCreator } from '../middlewares/project.middleware';

const router = Router();

router.use(authenticate);

// CRUD
router.post('/', createProject);
router.get('/', getProjects);
router.put('/:projectId', isProjectCreator, updateProject);
router.delete('/:projectId', isProjectCreator, deleteProject);

// Colaboradores
router.post('/:projectId/collaborators', isProjectCreator, addCollaborator);
router.delete('/:projectId/collaborators', isProjectCreator, removeCollaborator);

export default router;
