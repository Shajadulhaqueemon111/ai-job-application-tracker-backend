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
route.get('/', authValidateRequest(USER_ROLE.admin), getAllAdmin);
route.get('/:id', authValidateRequest(USER_ROLE.admin), getSingleAdmin);
route.patch(
  '/update-admin',
  authValidateRequest(USER_ROLE.admin),
  validateRequest(adminZodValidationSchema.updateAdminValidationSchema),
  updateAdmin,
);
route.post('/', deleteAdmin);

export const adminRoute = route;
