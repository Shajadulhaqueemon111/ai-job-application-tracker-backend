// src/modules/job/job.controller.ts

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import {
  getAllJobsFromDB,
  getSingleJobFromDB,
  createJobInDB,
  deleteJobInDB,
  createApplicationInDB,
  getApplicationsByJobFromDB,
  searchJobsInDB,
} from './job.service';
export const searchJobs = catchAsync(async (req, res) => {
  const { search, category, location } = req.query;

  const result = await searchJobsInDB({
    search: search as string,
    category: category as string,
    location: location as string,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jobs retrieved successfully',
    data: result,
  });
});
// ---------------- JOBS ----------------

export const getAllJobs = catchAsync(async (req, res) => {
  const result = await getAllJobsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jobs retrieved successfully',
    data: result,
  });
});

export const getSingleJob = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleJobFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single job retrieved successfully',
    data: result,
  });
});

export const createJob = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await createJobInDB(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Job created successfully',
    data: result,
  });
});

export const deleteJob = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteJobInDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job deleted successfully',
    data: result,
  });
});

// ---------------- APPLICATIONS ----------------

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

export const getApplicationsByJob = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  const result = await getApplicationsByJobFromDB(jobId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Applications for job retrieved successfully',
    data: result,
  });
});
