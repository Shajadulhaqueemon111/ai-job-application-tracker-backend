import express from 'express';
import { HRController } from './hr.controller';
import authValidateRequest from '../../middleware/authValidation';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// CREATE HR (Admin only)

// GET ALL HR
router.get('/', authValidateRequest(USER_ROLE.admin), HRController.getAllHR);

// GET SINGLE HR
router.get(
  '/:id',
  authValidateRequest(USER_ROLE.admin),
  HRController.getSingleHR,
);

// UPDATE HR
router.patch('/:id', authValidateRequest(USER_ROLE.hr), HRController.updateHR);

// DELETE HR
router.delete(
  '/:id',
  authValidateRequest(USER_ROLE.admin),
  HRController.deleteHR,
);

export const HRRoutes = router;
