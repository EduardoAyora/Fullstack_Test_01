import { Response } from 'express';
import Task from '../models/Task';
import { TaskRequest } from '../types/request';

// Crear tarea
export const createTask = async (req: TaskRequest, res: Response) => {
  const { description, priority, assignedTo, project } = req.body;

  const task = await Task.create({
    description,
    priority,
    project,
    assignedTo
  });

  res.status(201).json(task);
};

// Obtener tareas de un proyecto
export const getTasksByProject = async (req: TaskRequest, res: Response) => {
  const tasks = await Task.find({
    project: req.body.project
  })
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });

  res.json(tasks);
};

// Obtener tarea por ID
export const getTaskById = async (req: TaskRequest, res: Response) => {
  res.json(req.task);
};

// Actualizar tarea
export const updateTask = async (req: TaskRequest, res: Response) => {
  const { description, status, priority, assignedTo } = req.body;
  const task = req.task;

  task.description = description ?? task.description;
  task.status = status ?? task.status;
  task.priority = priority ?? task.priority;
  task.assignedTo = assignedTo ?? task.assignedTo;

  await task.save();

  res.json(task);
};

// Eliminar tarea
export const deleteTask = async (req: TaskRequest, res: Response) => {
  const task = req.task;

  await task.deleteOne();

  res.json({ message: 'Tarea eliminada correctamente' });
};
