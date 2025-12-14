import { Types } from 'mongoose';
import { IProject } from '../models/Project';
import { ITask } from '../models/Task';


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string | Types.ObjectId;
      };
      project?: IProject;
      task?: ITask;
    }
  }
}