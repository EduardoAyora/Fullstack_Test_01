import { Schema, model, Document, Types } from 'mongoose';

export enum TaskStatus {
  PENDING = 'pendiente',
  IN_PROGRESS = 'en progreso',
  COMPLETED = 'completada'
}

export enum TaskPriority {
  LOW = 'baja',
  MEDIUM = 'media',
  HIGH = 'alta'
}

export interface ITask extends Document {
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  project: Types.ObjectId;
  assignedTo: Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    description: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.PENDING
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default model<ITask>('Task', taskSchema);
