import { api } from './axios';

export const listProjects = (page = 1, limit = 10) =>
  api.get('/projects', { params: { page, limit } });

export const createProjectRequest = (name: string) =>
  api.post('/projects', { name });

export const getProjectById = (projectId: string) =>
  api.get(`/projects/${projectId}`);

export const addCollaboratorRequest = (
  projectId: string,
  email: string
) => api.post(`/projects/${projectId}/collaborators`, { email });
