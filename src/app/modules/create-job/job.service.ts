import { getIO } from '../../utils/soket';
import { JobApplication } from '../application/application.modle';

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

// job.service.ts ফাইলের উদাহরণ
const getAllJobsFromDB = async () => {
  const jobs = await JobModel.find().lean();

  // প্রতি জবের জন্য রিয়েল-টাইম অ্যাপ্লিকেশন সংখ্যা গণনা করা
  const updatedJobs = await Promise.all(
    jobs.map(async (job) => {
      const activeApplicationsCount = await JobApplication.countDocuments({
        jobId: job._id,
      });
      return {
        ...job,
        totalApplicants: activeApplicationsCount, // ডাটাবেজে যা-ই থাকুক, রিয়েল কাউন্ট দেখাবে
      };
    }),
  );

  return updatedJobs;
};
const getHrAllJobsFromDB = async (userId: string) => {
  const result = await JobModel.find({
    createdBy: userId,
  }).sort({ createdAt: -1 });

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
  getHrAllJobsFromDB,
  getAllJobsFromDB,
  getSingleJobFromDB,
  deleteJobFromDB,
  updateJobIntoDB,
};
