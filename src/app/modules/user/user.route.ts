import express from 'express';
import { userController } from './user.controller';
import validateRequest from '../../middleware/validationRequest';
import { adminZodValidationSchema } from '../admin/admin.zodvalidation';
import { UserzodValidationSchema } from './user.ZodValidation';
// import { StudentZodValidationSchema } from '../student/student.zodvalidation';
import authValidateRequest from '../../middleware/authValidation';
import { USER_ROLE } from './user.constant';
// import { TeacherZodValidationSchema } from '../teacher/teacher.zodvalidation';

const route = express.Router();

route.post(
  '/create-user',

  validateRequest(UserzodValidationSchema.createUserZodSchema),
  userController.createUser,
);
route.post(
  '/create-admin',
  validateRequest(adminZodValidationSchema.createAdminValidationSchema),
  userController.createAdmin,
);
// route.post(
//   '/create-student',
//   validateRequest(StudentZodValidationSchema.createStudentValidationSchema),
//   userController.createStudent,
// );
// route.post(
//   '/create-teacher',
//   validateRequest(TeacherZodValidationSchema.createTeacherValidationSchema),
//   userController.createTeacher,
// );
route.get('/', userController.getAllUser);
route.get('/:id', userController.getSingleUser);
route.patch(
  '/:id',
  authValidateRequest(USER_ROLE.admin),
  validateRequest(UserzodValidationSchema.updateUserZodSchema),
  userController.updateUser,
);
route.delete(
  '/:id',
  authValidateRequest(USER_ROLE.admin),
  userController.deleteUser,
);

export const userRouter = route;
