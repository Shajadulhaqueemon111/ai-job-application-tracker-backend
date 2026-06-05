import express from 'express';
import {
  createApplication,
  deleteJobApplication,
  getAllJobsApplication,
  getMyAllApplications,
  getMyApplications,
  updateJobApplication,
} from './application.controller';
import validateRequest from '../../middleware/validationRequest';

import authValidateRequest from '../../middleware/authValidation';
import { USER_ROLE } from '../user/user.constant';

import { getAllJobsApplicationFromDB } from './application.service';
import { ApplicationZodValidationSchema } from './application.zodvalidation';
import { upload } from './resume-upload';

const route = express.Router();
route.get(
  '/',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.hr),
  getAllJobsApplication,
);
// Submit a job application
route.post(
  '/create-application',
  authValidateRequest(USER_ROLE.user),
  upload.single('resume'),
  validateRequest(
    ApplicationZodValidationSchema.createApplicationValidationSchema,
  ),
  createApplication,
);
route.get(
  '/my-applications',
  authValidateRequest(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.hr),
  getMyApplications,
);
route.get(
  '/my-all-applications',
  authValidateRequest(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.hr),
  getMyAllApplications,
);
// Get all applications for a job (admin only)
route.get(
  '/:jobId',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.hr),
  getAllJobsApplication,
);
route.delete(
  '/:id',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.hr),
  deleteJobApplication,
);
route.patch(
  '/:id',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.hr),
  updateJobApplication,
);
export const ApplicationRoute = route;
