import { Router } from 'express';
import {
    createTask,
    getTasksByProject,
    getTaskById,
    updateTask,
    deleteTask
} from '../controllers/task.controller';

import { authenticate } from '../middlewares/auth.middleware';
import { findTask } from '../middlewares/task.middleware';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post('/:projectId/tasks', createTask);
router.get('/:projectId/tasks', getTasksByProject);
router.get('/:projectId/tasks/:taskId', findTask, getTaskById);
router.put('/:projectId/tasks/:taskId', findTask, updateTask);
router.delete('/:projectId/tasks/:taskId', findTask, deleteTask);

export default router;
