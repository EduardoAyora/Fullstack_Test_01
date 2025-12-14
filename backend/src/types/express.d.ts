import { Types } from 'mongoose';
import { IProject } from '../models/Project';
import { ITask } from '../models/Task';
import { IUser } from '../models/User';


declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      project?: IProject;
      task?: ITask;
    }
  }
}