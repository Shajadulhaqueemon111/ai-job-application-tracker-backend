import express from 'express';
import {
  deleteAdmin,
  getAllAdmin,
  getSingleAdmin,
  updateAdmin,
} from './admin.controller';

import { adminZodValidationSchema } from './admin.zodvalidation';
import validateRequest from '../../middleware/validationRequest';
import authValidateRequest from '../../middleware/authValidation';
import { USER_ROLE } from '../user/user.constant';

const route = express.Router();
route.get('/', getAllAdmin);
route.get('/:id', getSingleAdmin);
route.patch(
  '/',
  authValidateRequest(USER_ROLE.admin),
  validateRequest(adminZodValidationSchema.updateAdminValidationSchema),
  updateAdmin,
);
route.post('/', deleteAdmin);
