"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validationRequest_1 = __importDefault(require("../../middleware/validationRequest"));
const admin_zodvalidation_1 = require("../admin/admin.zodvalidation");
const user_ZodValidation_1 = require("./user.ZodValidation");
// import { StudentZodValidationSchema } from '../student/student.zodvalidation';
const authValidation_1 = __importDefault(require("../../middleware/authValidation"));
const user_constant_1 = require("./user.constant");
// import { TeacherZodValidationSchema } from '../teacher/teacher.zodvalidation';
const route = express_1.default.Router();
route.post('/create-user', (0, validationRequest_1.default)(user_ZodValidation_1.UserzodValidationSchema.createUserZodSchema), user_controller_1.userController.createUser);
route.post('/create-admin', (0, validationRequest_1.default)(admin_zodvalidation_1.adminZodValidationSchema.createAdminValidationSchema), user_controller_1.userController.createAdmin);
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
route.get('/', user_controller_1.userController.getAllUser);
route.get('/:id', user_controller_1.userController.getSingleUser);
route.patch('/:id', (0, authValidation_1.default)(user_constant_1.USER_ROLE.admin), (0, validationRequest_1.default)(user_ZodValidation_1.UserzodValidationSchema.updateUserZodSchema), user_controller_1.userController.updateUser);
route.delete('/:id', (0, authValidation_1.default)(user_constant_1.USER_ROLE.admin), user_controller_1.userController.deleteUser);
exports.userRouter = route;
