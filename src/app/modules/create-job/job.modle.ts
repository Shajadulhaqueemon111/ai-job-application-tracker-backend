// src/modules/job/job.model.ts

import mongoose, { Schema, model } from 'mongoose';
import { IApplication, IJob } from './job.interface';

// Job Schema
const jobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Application Schema
const applicationSchema = new Schema<IApplication>({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  resumeLink: { type: String, required: true },
  coverNote: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const JobModel = model<IJob>('Job', jobSchema);
export const ApplicationModel = model<IApplication>(
  'Application',
  applicationSchema,
);
