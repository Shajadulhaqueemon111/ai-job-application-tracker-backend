import { JobModel } from '../create-job/job.modle';
import { IJobApplication } from './application.interface';
import { JobApplication } from './application.modle';

// Create a new application
export const createApplicationInDB = async (data: IJobApplication) => {
  const existingApplication = await JobApplication.findOne({
    jobId: data.jobId,
    email: data.email,
    userId: data.userId,
  });

  if (existingApplication) {
    throw new Error('You have already applied for this job');
  }

  const application = await JobApplication.create(data);

  await JobModel.findByIdAndUpdate(data.jobId, {
    $inc: { totalApplicants: 1 },
  });

  return application.toObject();
};

export const getAllJobsApplicationFromDB = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  return await JobApplication.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const deleteJobApplicationInDB = async (id: string) => {
  const application = await JobApplication.findById(id);

  if (!application) {
    throw new Error('Application not found');
  }

  await JobModel.findByIdAndUpdate(application.jobId, {
    $inc: { applicationCount: -1 },
  });

  return await JobApplication.findByIdAndDelete(id);
};
export const updateApplicationInDB = async (
  id: string,
  payload: Partial<IJobApplication>,
) => {
  const application = await JobApplication.findById(id);

  if (!application) {
    throw new Error('Application not found');
  }

  const updatedApplication = await JobApplication.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedApplication;
};
export const getUserApplicationsFromDB = async (userId: string) => {
  return await JobApplication.find({ userId }).lean();
};
export const getMyApplicationsFromDB = async (userId: string) => {
  return await JobApplication.find({ userId })
    .populate('jobId', 'title company location salary jobType')
    .sort({ createdAt: -1 })
    .lean();
};
// Get a single application by ID
export const getSingleApplicationFromDB = async (id: string) => {
  const application = await JobApplication.findById(id)
    .populate('jobId', 'title company location')
    .lean();

  if (!application) {
    throw new Error('Application not found');
  }

  return application;
};
