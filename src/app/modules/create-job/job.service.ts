// src/modules/job/job.service.ts

import { IJob, IApplication } from './job.interface';
import { ApplicationModel, JobModel } from './job.modle';

// JOBS
export const searchJobsInDB = async (params: {
  search?: string;
  category?: string;
  location?: string;
}): Promise<IJob[]> => {
  const { search, category, location } = params;

  const filter: any = {};

  if (search) {
    filter.title = { $regex: search, $options: 'i' }; // case-insensitive search
  }

  if (category) {
    filter.category = category;
  }

  if (location) {
    filter.location = location;
  }

  return await JobModel.find(filter).sort({ createdAt: -1 });
};
export const getAllJobsFromDB = async (): Promise<IJob[]> => {
  return await JobModel.find().sort({ createdAt: -1 });
};

export const getSingleJobFromDB = async (id: string): Promise<IJob | null> => {
  return await JobModel.findById(id);
};

export const createJobInDB = async (data: IJob): Promise<IJob> => {
  const job = new JobModel(data);
  return await job.save();
};

export const deleteJobInDB = async (id: string): Promise<IJob | null> => {
  return await JobModel.findByIdAndDelete(id);
};

// APPLICATIONS

export const createApplicationInDB = async (
  data: IApplication,
): Promise<IApplication> => {
  const application = new ApplicationModel(data);
  return await application.save();
};

export const getApplicationsByJobFromDB = async (
  jobId: string,
): Promise<IApplication[]> => {
  return await ApplicationModel.find({ jobId });
};
