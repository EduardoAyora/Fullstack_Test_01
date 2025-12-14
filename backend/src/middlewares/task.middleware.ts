import { Response, Request, NextFunction } from 'express';
import Task from '../models/Task';

export const findTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    if (task.project.toString() !== req.project!._id.toString()) {
        return res.status(403).json({ message: 'Acceso denegado' });
    }

    req.task = task;
    next();
};
