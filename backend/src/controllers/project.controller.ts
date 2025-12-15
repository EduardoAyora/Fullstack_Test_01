import { Response, Request } from 'express';
import Project from '../models/Project';
import User from '../models/User';
import Task from '../models/Task';

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

export const getProjectById = async (req: Request, res: Response) => {
  const project = await Project.findById(req.project!._id)
    .populate('creator', 'name email')
    .populate('collaborators', 'name email');

  res.json(project);
};

// Obtener proyectos del usuario
export const getProjects = async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);
  const skip = (page - 1) * limit;
  const name =
    typeof req.query.name === 'string' ? req.query.name.trim() : '';

  const filter: Record<string, unknown> = {
    $or: [
      { creator: userId },
      { collaborators: userId }
    ]
  };

  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }

  const [total, projects] = await Promise.all([
    Project.countDocuments(filter),
    Project.find(filter)
      .populate('creator', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
  ]);

  res.json({
    projects,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 0,
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1
  });
};

// Actualizar proyecto
export const updateProject = async (req: Request, res: Response) => {
  const { name } = req.body;

  const project = req.project!;
  project.name = name ?? project.name;

  await project.save();

  res.json(project);
};

// Eliminar proyecto
export const deleteProject = async (req: Request, res: Response) => {
  const project = req.project!;

  await project.deleteOne();

  res.json({ message: 'Proyecto eliminado correctamente' });
};

// Agregar colaborador
export const addCollaborator = async (req: Request, res: Response) => {
  const { email } = req.body;
  const project = req.project!;

  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const alreadyCollaborator = project.collaborators.some((id) =>
    id.equals(user._id)
  );
  if (alreadyCollaborator) {
    return res.status(400).json({ message: 'El usuario ya es colaborador' });
  }

  project.collaborators.push(user._id);
  await project.save();

  res.json(project);
};

// Eliminar colaborador
export const removeCollaborator = async (req: Request, res: Response) => {
  const { collaboratorId } = req.body;
  const project = req.project!;

  const assignedTaskExists = await Task.exists({
    project: project._id,
    assignedTo: collaboratorId
  });

  if (assignedTaskExists) {
    return res.status(400).json({
      message:
        'No se puede eliminar al colaborador porque tiene tareas asignadas en este proyecto'
    });
  }

  project.collaborators = project.collaborators.filter(
    (id) => id.toString() !== collaboratorId
  );

  await project.save();

  res.json(project);
};
