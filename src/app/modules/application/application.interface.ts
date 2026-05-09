import { Types } from 'mongoose';

export interface IApplication {
  jobId: Types.ObjectId; // Link to the job
  name: string;
  email: string;
  resumeLink: string;
  coverNote?: string;
  createdAt?: Date;
}
