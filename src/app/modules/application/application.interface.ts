import { Types } from 'mongoose';

export interface IJobApplication {
  jobId: Types.ObjectId;
  userId?: string; // যদি logged-in user থাকে

  fullName: string;
  email: string;
  phone: string;

  linkedin?: string;
  portfolio?: string;

  experience: string; // "3 Years" or number convert করলেও ভালো
  coverLetter: string;

  resumeUrl: string; // file upload হলে cloudinary/s3 URL

  agreement: boolean;

  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';

  createdAt?: Date;
  updatedAt?: Date;
}
