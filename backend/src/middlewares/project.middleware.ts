import { Request, Response, NextFunction } from 'express';
import Project from '../models/Project';

type AccessOptions = {
  includeCollaborators?: boolean;
};

const projectAccessGuard =
  ({ includeCollaborators = false }: AccessOptions = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params;
    const userId = req.user!._id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const isCreator = project.creator.equals(userId);
    const isCollaborator =
      includeCollaborators &&
      project.collaborators.some((id) => id.equals(userId));

    if (!isCreator && !isCollaborator) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    req.project = project;
    next();
  };

export const isProjectCreator = projectAccessGuard();

export const isProjectCreatorOrCollaborator = projectAccessGuard({
  includeCollaborators: true,
});
