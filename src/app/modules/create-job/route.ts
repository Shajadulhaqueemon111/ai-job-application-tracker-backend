import express from 'express';

import validateRequest from '../../middleware/validationRequest';
import authValidateRequest from '../../middleware/authValidation';

import { JobControllers } from './job.controller';
import { JobZodValidationSchema } from './job.validationschema';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// ---------------- CREATE JOB ----------------
router.post(
  '/create-job',
  authValidateRequest(USER_ROLE.hr),
  validateRequest(JobZodValidationSchema.createJobValidationSchema),
  JobControllers.createJob,
);

// ---------------- GET ALL JOBS ----------------
router.get(
  '/',
  authValidateRequest(USER_ROLE.user),
  authValidateRequest(USER_ROLE.hr),
  JobControllers.getAllJobs,
);

// ---------------- GET SINGLE JOB ----------------
router.get(
  '/:id',
  authValidateRequest(USER_ROLE.user),
  authValidateRequest(USER_ROLE.hr),
  JobControllers.getSingleJob,
);

router.patch(
  '/:id',
  authValidateRequest(USER_ROLE.hr),
  validateRequest(JobZodValidationSchema.createJobValidationSchema), // or update schema (better)
  JobControllers.updateJob,
);

// ---------------- DELETE JOB ----------------
router.delete(
  '/:id',
  authValidateRequest(USER_ROLE.hr),
  JobControllers.deleteJob,
);

export const JobRoutes = router;
