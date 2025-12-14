import { api } from './axios';

export const getTasksByProject = (projectId: string) =>
  api.get('/tasks', { params: { projectId } });

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
