import { Request, Response, NextFunction } from 'express';
import Project from '../models/Project';

export const isProjectCreator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: 'Proyecto no encontrado' });
  }

  if (project.creator.toString() !== req.user!.id) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  req.project = project;
  next();
};
