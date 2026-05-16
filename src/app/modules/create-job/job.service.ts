import { TJob } from './job.interface';
import { JobModel } from './job.modle';

const createJobIntoDB = async (payload: TJob) => {
  const result = await JobModel.create(payload);

  return result;
};

const getAllJobsFromDB = async () => {
  const result = await JobModel.find().populate('createdBy');

  return result;
};

const getSingleJobFromDB = async (id: string) => {
  const result = await JobModel.findById(id).populate('createdBy');

  return result;
};
const updateJobIntoDB = async (id: string, payload: Partial<TJob>) => {
  const result = await JobModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteJobFromDB = async (id: string) => {
  const result = await JobModel.findByIdAndDelete(id);

  return result;
};

export const JobServices = {
  createJobIntoDB,
  getAllJobsFromDB,
  getSingleJobFromDB,
  deleteJobFromDB,
  updateJobIntoDB,
};
