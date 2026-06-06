import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { JobServices } from './job.service';
import sendResponse from '../../utils/sendResponse';
import { uploadToCloudinary } from '../upload/upload-service';

const createJob = async (req: Request, res: Response) => {
  const user = req.user;

  let logoUrl = '';

  if (req.file) {
    const result: any = await uploadToCloudinary(req.file.buffer);
    logoUrl = result.secure_url;
  }

  const salary = req.body.salary;

  const jobData = {
    title: req.body.title,
    location: req.body.location,
    workType: req.body.workType,
    employmentType: req.body.employmentType,
    experienceLevel: req.body.experienceLevel,
    description: req.body.description,
    applicationDeadline: req.body.applicationDeadline,
    status: req.body.status,

    company: {
      name: req.body.company?.name,
      logo: logoUrl,
      website: req.body.company?.website,
    },

    salary: {
      min: Number(salary.min),
      max: Number(salary.max),
      currency: salary.currency,
    },

    skills: Array.isArray(req.body.skills)
      ? req.body.skills.filter((s: string) => s.trim())
      : [],

    responsibilities: req.body.responsibilities || [],
    requirements: req.body.requirements || [],
    benefits: req.body.benefits || [],

    createdBy: user._id,
  };

  const result = await JobServices.createJobIntoDB(jobData);

  return res.json({
    success: true,
    data: result,
  });
};

const getAllJobs = async (req: Request, res: Response) => {
  const userId = req.user?._id; // 🔥 FIXED (_id not id)

  const result = await JobServices.getAllJobsFromDB(userId);

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
