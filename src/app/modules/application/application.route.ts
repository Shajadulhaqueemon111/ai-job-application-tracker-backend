import express from 'express';
import {
  createApplication,
  deleteJobApplication,
  getAllJobsApplication,
  getApplicationsByJob,
} from './application.controller';
import validateRequest from '../../middleware/validationRequest';

import authValidateRequest from '../../middleware/authValidation';
import { USER_ROLE } from '../user/user.constant';
import { ApplicationZodValidationSchema } from './application.zodvalidation';
import { getAllJobsApplicationFromDB } from './application.service';

const route = express.Router();
route.get('/', getAllJobsApplication);
// Submit a job application
route.post(
  '/',
  validateRequest(
    ApplicationZodValidationSchema.createApplicationValidationSchema,
  ),
  createApplication,
);

// Get all applications for a job (admin only)
route.get(
  '/:jobId',
  // authValidateRequest(USER_ROLE.admin, USER_ROLE.admin),
  getApplicationsByJob,
);
route.delete(
  '/:id',
  //   authValidateRequest(USER_ROLE.admin, USER_ROLE.admin, USER_ROLE.user),
  deleteJobApplication,
);
export const ApplicationRoute = route;
