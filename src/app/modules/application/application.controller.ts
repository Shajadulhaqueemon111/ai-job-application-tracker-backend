import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import {
  createApplicationInDB,
  deleteJobApplicationInDB,
  getAllJobsApplicationFromDB,
  getApplicationsByJobFromDB,
} from './application.service';

// Global Job Search

// Submit application
export const createApplication = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await createApplicationInDB(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Application submitted successfully',
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
// Get applications by job
export const getApplicationsByJob = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  const result = await getApplicationsByJobFromDB(jobId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Applications retrieved successfully',
    data: result,
  });
});
