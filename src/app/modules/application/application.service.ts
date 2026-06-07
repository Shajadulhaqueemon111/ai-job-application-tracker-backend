import { getIO } from '../../utils/soket';
import { JobModel } from '../create-job/job.modle';
import { NotificationModel } from '../notification/notification.model';
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

  // 🔥 get job with HR
  const job = await JobModel.findById(data.jobId);

  if (job) {
    await JobModel.findByIdAndUpdate(data.jobId, {
      $inc: { totalApplicants: 1 },
    });

    // 🔥 notify HR (IMPORTANT PART)
    await NotificationModel.create({
      userId: job.createdBy, // 👈 HR ID
      title: 'New Job Application',
      message: `${data.fullName} applied to your job: ${job.title}`,
      type: 'APPLICATION',
      read: false,
    });
  }

  return application.toObject();
};

export const getAllJobsApplicationFromDB = async (query: any) => {
  const { page = 1, limit = 10, hrId, userId, jobId, search, status } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = {};

  // 🔥 HR wise filter (IMPORTANT)
  if (hrId) {
    // HR → job relation
    const jobs = await JobModel.find({ createdBy: hrId }).select('_id');
    const jobIds = jobs.map((j) => j._id);

    filter.jobId = { $in: jobIds };
  }

  if (userId) filter.userId = userId;
  if (jobId) filter.jobId = jobId;
  if (status) filter.status = status;

  // 🔥 search (name/email/phone)
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const data = await JobApplication.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('jobId', 'title company location salary jobType')
    .lean();

  const total = await JobApplication.countDocuments(filter);

  return {
    data,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
  };
};

export const deleteApplicationFromDB = async (applicationId: string) => {
  const application = await JobApplication.findById(applicationId);
  if (!application) throw new Error('Application not found');

  await JobApplication.findByIdAndDelete(applicationId);

  await JobModel.findByIdAndUpdate(application.jobId, {
    $inc: { totalApplicants: -1 },
  });

  return { message: 'Application deleted successfully' };
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
  )
    .populate('userId')
    .populate('jobId')
    .lean(); // 🔥 important for clean object

  if (!updatedApplication?.userId) return;

  // ----------------------------
  // ✅ Create Notification (SAFE)
  // ----------------------------
  const notification = await NotificationModel.create({
    userId: updatedApplication.userId?._id || updatedApplication.userId,
    type: 'APPLICATION_STATUS_UPDATED',
    title: 'Application Status Updated',
    message: `Your application for ${
      (updatedApplication.jobId as any)?.title || 'a job'
    } has been updated to ${updatedApplication.status}`,
    read: false,
  });

  // ----------------------------
  // ✅ Socket Emit (SAFE)
  // ----------------------------
  try {
    const io = getIO();

    io.to(updatedApplication.userId?.toString()).emit(
      'notification',
      notification,
    );
  } catch (error) {
    console.log('Socket not ready yet:', error);
  }

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
