import { api } from './axios';

export const getTasksByProject = (projectId: string) =>
  api.get('/tasks', { params: { projectId } });

export const createTaskRequest = (
  projectId: string,
  payload: { description: string; priority: 'baja' | 'media' | 'alta' }
) => api.post(`/projects/${projectId}/tasks`, payload);
