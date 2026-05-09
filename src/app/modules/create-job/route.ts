// src/modules/job/job.route.ts

import express from 'express';

import validateRequest from '../../middleware/validationRequest';

import authValidateRequest from '../../middleware/authValidation';
import { USER_ROLE } from '../user/user.constant';

import {
  createApplication,
  createJob,
  deleteJob,
  getAllJobs,
  getApplicationsByJob,
  getSingleJob,
  searchJobs,
} from '../create-job/job.controller';
import { JobZodValidationSchema } from './job.validationschema';

const route = express.Router();

// ---------------- JOBS ----------------
route.get('/search', searchJobs);
// List all jobs
route.get('/', getAllJobs);

// Get single job details
route.get('/:id', getSingleJob);

// Create a job (Admin only)
route.post(
  '/create-job',
  //   authValidateRequest(USER_ROLE.admin, USER_ROLE.admin, USER_ROLE.user),
  validateRequest(JobZodValidationSchema.createJobValidationSchema),
  createJob,
);

// Delete a job (Admin only)
route.delete(
  '/:id',
  //   authValidateRequest(USER_ROLE.admin, USER_ROLE.admin, USER_ROLE.user),
  deleteJob,
);

// Submit a job application
route.post(
  '/:jobId/applications',
  validateRequest(JobZodValidationSchema.createApplicationValidationSchema),
  createApplication,
);

// Get all applications for a specific job (Admin only)
route.get(
  '/:jobId/applications',
  //   authValidateRequest(USER_ROLE.admin, USER_ROLE.admin, USER_ROLE.user),
  getApplicationsByJob,
);

export const JobRoute = route;
