import { Schema, model, Document, Types } from 'mongoose';

export interface IProject extends Document {
  name: string;
  creator: Types.ObjectId;
  collaborators: Types.ObjectId[];
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

export default model<IProject>('Project', projectSchema);
