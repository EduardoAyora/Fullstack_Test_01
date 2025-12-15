import { api } from './axios';

export const getTasksByProject = (
  projectId: string,
  filters?: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    sort?: string;
  }
) => api.get('/tasks', { params: { projectId, ...filters } });

export const createTaskRequest = (
  projectId: string,
  payload: {
    description: string;
    priority: 'baja' | 'media' | 'alta';
    assignedTo: string;
  }
) => api.post(`/projects/${projectId}/tasks`, payload);

export const deleteTaskRequest = (projectId: string, taskId: string) =>
  api.delete(`/projects/${projectId}/tasks/${taskId}`);

export const updateTaskRequest = (
  projectId: string,
  taskId: string,
  payload: {
    description: string;
    priority: 'baja' | 'media' | 'alta';
    status: 'pendiente' | 'en progreso' | 'completada';
    assignedTo: string;
  }
) => api.put(`/projects/${projectId}/tasks/${taskId}`, payload);
