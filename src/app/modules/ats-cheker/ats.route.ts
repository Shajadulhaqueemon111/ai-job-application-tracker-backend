import express from 'express';

import authValidateRequest from '../../middleware/authValidation';
import { USER_ROLE } from '../user/user.constant';
import { analyzeApplicationController } from './ats.controller';

const router = express.Router();

router.post(
  '/match',
  authValidateRequest(USER_ROLE.hr),
  analyzeApplicationController,
);

export const AtsRoutes = router;
