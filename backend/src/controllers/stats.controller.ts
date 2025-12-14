import { Request, Response } from 'express';
import Project from '../models/Project';
import Task, { TaskPriority, TaskStatus } from '../models/Task';

// Devuelve métricas agregadas para el usuario autenticado
export const getUserStats = async (req: Request, res: Response) => {
  const userId = req.user!._id;

  const projectFilter = {
    $or: [
      { creator: userId },
      { collaborators: userId }
    ]
  };

  const [projects, totalProjects] = await Promise.all([
    Project.find(projectFilter).select('_id'),
    Project.countDocuments(projectFilter)
  ]);

  const projectIds = projects.map((project) => project._id);
  const taskMatch =
    projectIds.length > 0
      ? { project: { $in: projectIds } }
      : { _id: { $in: [] as string[] } };

  const [totalTasks, tasksByStatusAgg, tasksByPriorityAgg, assignedToUser] =
    await Promise.all([
      Task.countDocuments(taskMatch),
      Task.aggregate([
        { $match: taskMatch },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Task.aggregate([
        { $match: taskMatch },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      projectIds.length > 0
        ? Task.countDocuments({ ...taskMatch, assignedTo: userId })
        : Promise.resolve(0)
    ]);

  const reduceAgg = (
    items: Array<{ _id: string; count: number }>,
    keys: string[]
  ) => {
    const base = keys.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as Record<string, number>);

    items.forEach(({ _id, count }) => {
      base[_id] = count;
    });

    return base;
  };

  const tasksByStatus = reduceAgg(tasksByStatusAgg, Object.values(TaskStatus));
  const tasksByPriority = reduceAgg(tasksByPriorityAgg, Object.values(TaskPriority));
  const completedTasks = tasksByStatus[TaskStatus.COMPLETED] ?? 0;

  res.json({
    totalProjects,
    totalTasks,
    tasksByStatus,
    tasksByPriority,
    assignedToUser,
    completionRate: totalTasks > 0 ? completedTasks / totalTasks : 0,
    avgTasksPerProject: totalProjects > 0 ? totalTasks / totalProjects : 0
  });
};
