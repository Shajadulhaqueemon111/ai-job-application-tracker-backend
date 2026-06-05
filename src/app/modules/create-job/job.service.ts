import { getIO } from '../../utils/soket';

import { NotificationModel } from '../notification/notification.model';
import { TJob } from './job.interface';
import { JobModel } from './job.modle';

const createJobIntoDB = async (payload: TJob) => {
  const result = await JobModel.create(payload);

  // 🔥 save notification in DB
  const notification = await NotificationModel.create({
    userId: null,
    type: 'NEW_JOB',
    title: 'New Job Alert 🚀',
    message: `${result.title} job just posted`,
    read: false,
  });

  // 🔥 safe socket emit
  try {
    const io = getIO();

    io.emit('notification', notification);
  } catch (error) {
    console.log('Socket not ready yet:",error');
  }

  return result;
};

const getAllJobsFromDB = async () => {
  const result = await JobModel.find();

  return result;
};

const getSingleJobFromDB = async (id: string) => {
  const result = await JobModel.findById(id);

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
