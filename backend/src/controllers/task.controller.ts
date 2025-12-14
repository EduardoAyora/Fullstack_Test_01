import { Request, Response } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';

// Crear tarea
export const createTask = async (req: Request, res: Response) => {
  const { description, priority, assignedTo } = req.body;
  const project = req.project!._id;

  const task = await Task.create({
    description,
    priority,
    project,
    assignedTo
  });

  res.status(201).json(task);
};

// Obtener tareas de un proyecto
export const getTasksByProject = async (req: Request, res: Response) => {
  const { status, priority, assignedTo, projectId, sort } = req.query;
  
  const userId = req.user!._id;

  const accessibleProjectIds = await Project.find({
    $or: [
      { creator: userId },
      { collaborators: userId }
    ]
  }).distinct('_id');

  const allowedProjects =
    typeof projectId === 'string'
      ? accessibleProjectIds.filter((id) => id.toString() === projectId)
      : accessibleProjectIds;

  if (typeof projectId === 'string' && allowedProjects.length === 0) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  const filter: Record<string, unknown> = {
    project: { $in: allowedProjects }
  };

  if (typeof status === 'string') {
    filter.status = status;
  }

  if (typeof priority === 'string') {
    filter.priority = priority;
  }

  if (typeof assignedTo === 'string') {
    filter.assignedTo = assignedTo;
  }

  if (typeof projectId === 'string') {
    filter.project = projectId;
  }

  const sortOptions: Record<string, 1 | -1> = {};

  if (typeof sort === 'string') {
    sort.split(',').forEach((chunk) => {
      const entry = chunk.trim();

      if (!entry) return;

      if (entry.startsWith('-') && entry.length > 1) {
        sortOptions[entry.slice(1)] = -1;
        return;
      }

      const [field, rawDirection] = entry.split(':').map((value) => value.trim());

      if (!field) return;

      const direction =
        rawDirection?.toLowerCase() === 'asc' || rawDirection === '1' ? 1 : -1;

      sortOptions[field] = direction;
    });
  }

  if (Object.keys(sortOptions).length === 0) {
    sortOptions.createdAt = -1;
  }

  const tasks = await Task.find(filter)
    .populate('assignedTo', 'name email')
    .sort(sortOptions);

  res.json(tasks);
};

// Obtener tarea por ID
export const getTaskById = async (req: Request, res: Response) => {
  res.json(req.task);
};

// Actualizar tarea
export const updateTask = async (req: Request, res: Response) => {
  const { description, status, priority, assignedTo } = req.body;
  const task = req.task!;

  task.description = description ?? task.description;
  task.status = status ?? task.status;
  task.priority = priority ?? task.priority;
  task.assignedTo = assignedTo ?? task.assignedTo;

  await task.save();

  res.json(task);
};

// Eliminar tarea
export const deleteTask = async (req: Request, res: Response) => {
  const task = req.task!;

  await task.deleteOne();

  res.json({ message: 'Tarea eliminada correctamente' });
};
