import { JobModel } from '../create-job/job.modle';
import { IApplication } from './application.interface';
import { ApplicationModel } from './application.modle';

// Create a new application
export const createApplicationInDB = async (
  data: IApplication,
): Promise<IApplication> => {
  const application = new ApplicationModel(data);
  return await application.save();
};
export const getAllJobsApplicationFromDB = async (): Promise<
  IApplication[]
> => {
  return await ApplicationModel.find().sort({ createdAt: -1 });
};

export const deleteJobApplicationInDB = async (
  id: string,
): Promise<IApplication | null> => {
  return await ApplicationModel.findByIdAndDelete(id);
};
// Get all applications for a job
export const getApplicationsByJobFromDB = async (
  jobId: string,
): Promise<IApplication[]> => {
  return await ApplicationModel.find({ jobId });
};
