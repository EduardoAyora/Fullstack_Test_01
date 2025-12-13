import { Request } from 'express';
import { IProject } from '../models/Project';
import { ITask } from '../models/Task';

export interface AuthRequest extends Request {
  user: { id: string };
}

export interface ProjectRequest extends AuthRequest {
  project: IProject;
}

export interface TaskRequest extends AuthRequest {
  task: ITask;
}
