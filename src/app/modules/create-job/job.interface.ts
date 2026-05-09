// src/modules/job/job.interface.ts

import { Types } from 'mongoose';

export interface IJob {
  _id?: string;
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  createdAt?: Date;
}

export interface IApplication {
  _id?: string;
  jobId: Types.ObjectId;
  name: string;
  email: string;
  resumeLink: string;
  coverNote: string;
  createdAt?: Date;
}
