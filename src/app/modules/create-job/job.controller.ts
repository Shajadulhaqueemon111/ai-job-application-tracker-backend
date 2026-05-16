import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { JobServices } from './job.service';
import sendResponse from '../../utils/sendResponse';

const createJob = async (req: Request, res: Response) => {
  try {
    const result = await JobServices.createJobIntoDB(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Job created successfully',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Something went wrong',
      data: error,
    });
  }
};

const getAllJobs = async (req: Request, res: Response) => {
  const result = await JobServices.getAllJobsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jobs retrieved successfully',
    data: result,
  });
};

const getSingleJob = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await JobServices.getSingleJobFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job retrieved successfully',
    data: result,
  });
};

const deleteJob = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await JobServices.deleteJobFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job deleted successfully',
    data: result,
  });
};
const updateJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await JobServices.updateJobIntoDB(id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Job updated successfully',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Failed to update job',
      data: error,
    });
  }
};
export const JobControllers = {
  createJob,
  getAllJobs,
  getSingleJob,
  deleteJob,
  updateJob,
};
