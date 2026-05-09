import mongoose, { Schema, model, models } from 'mongoose';
import { IApplication } from './application.interface';

const applicationSchema = new Schema<IApplication>({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  resumeLink: { type: String, required: true },
  coverNote: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const ApplicationModel =
  models.Application || model<IApplication>('Application', applicationSchema);
