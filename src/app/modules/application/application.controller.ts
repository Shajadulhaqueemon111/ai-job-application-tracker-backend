import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import {
  createApplicationInDB,
  deleteJobApplicationInDB,
  getAllJobsApplicationFromDB,
  getMyApplicationsFromDB,
  getSingleApplicationFromDB,
  getUserApplicationsFromDB,
  updateApplicationInDB,
} from './application.service';
import { uploadToCloudinary } from './resumi-cloudinary-upload';

// Global Job Search

// Submit application
// export const createApplication = catchAsync(async (req, res) => {
//   const payload = req.body;
//   const result = await createApplicationInDB(payload);

//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: 'Application submitted successfully',
//     data: result,
//   });
// });
export const createApplication = async (req: any, res: any) => {
  const file = req.file;

  if (!file) {
    throw new Error('Resume file is required');
  }

  // 🔥 upload to cloudinary
  const uploaded: any = await uploadToCloudinary(file);
  const user = req.user;
  const payload = {
    ...req.body,
    userId: user._id,
    resumeUrl: uploaded.secure_url, // 👈 here
  };

  const result = await createApplicationInDB(payload);

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: result,
  });
};
export const getMyApplications = catchAsync(async (req, res) => {
  const userId = req.query.userId;

  const result = await getUserApplicationsFromDB(userId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My applications retrieved successfully',
    data: result,
  });
});
export const getMyAllApplications = catchAsync(async (req, res) => {
  const userId = req.query.userId;

  const result = await getMyApplicationsFromDB(userId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My applications retrieved successfully',
    data: result,
  });
});

export const getAllJobsApplication = catchAsync(async (req, res) => {
  const result = await getAllJobsApplicationFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jobs Application retrieved successfully',
    data: result,
  });
});
export const deleteJobApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteJobApplicationInDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job deleted successfully',
    data: result,
  });
});
export const updateJobApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await updateApplicationInDB(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job updated successfully',
    data: result,
  });
});
export const getSingleJobApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleApplicationFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job application retrieved successfully',
    data: result,
  });
});

// Get applications by job
