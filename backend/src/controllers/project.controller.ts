import { Response, Request } from 'express';
import Project from '../models/Project';
import { Types } from 'mongoose';

// Crear proyecto
export const createProject = async (req: Request, res: Response) => {
  const { name } = req.body;

  const project = await Project.create({
    name,
    creator: req.user!._id,
    collaborators: []
  });

  res.status(201).json(project);
};

// Obtener proyectos del usuario
export const getProjects = async (req: Request, res: Response) => {
  const userId = req.user!._id;

  const projects = await Project.find({
    $or: [
      { creator: userId },
      { collaborators: userId }
    ]
  }).populate('creator', 'name email');

  res.json(projects);
};

// Actualizar proyecto
export const updateProject = async (req: Request, res: Response) => {
  const { name } = req.body;

  const project = req.project!;
  project.name = name ?? project.name;

  await project.save();

  res.json(project);
};

// Agregar colaborador
export const addCollaborator = async (req: Request, res: Response) => {
  const { collaboratorId } = req.body;
  const project = req.project!;

  if (project.collaborators.includes(collaboratorId)) {
    return res.status(400).json({ message: 'El usuario ya es colaborador' });
  }

  project.collaborators.push(new Types.ObjectId(collaboratorId));
  await project.save();

  res.json(project);
};

// Eliminar colaborador
export const removeCollaborator = async (req: Request, res: Response) => {
  const { collaboratorId } = req.body;
  const project = req.project!;

  project.collaborators = project.collaborators.filter(
    (id) => id.toString() !== collaboratorId
  );

  await project.save();

  res.json(project);
};

// Eliminar proyecto
export const deleteProject = async (req: Request, res: Response) => {
  const project = req.project!;

  await project.deleteOne();

  res.json({ message: 'Proyecto eliminado correctamente' });
};
