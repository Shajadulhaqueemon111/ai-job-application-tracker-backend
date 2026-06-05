"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRoute = void 0;
const express_1 = __importDefault(require("express"));
const application_controller_1 = require("./application.controller");
const validationRequest_1 = __importDefault(require("../../middleware/validationRequest"));
const authValidation_1 = __importDefault(require("../../middleware/authValidation"));
const user_constant_1 = require("../user/user.constant");
const application_zodvalidation_1 = require("./application.zodvalidation");
const resume_upload_1 = require("./resume-upload");
const route = express_1.default.Router();
route.get('/', (0, authValidation_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.hr), application_controller_1.getAllJobsApplication);
// Submit a job application
route.post('/create-application', (0, authValidation_1.default)(user_constant_1.USER_ROLE.user), resume_upload_1.upload.single('resume'), (0, validationRequest_1.default)(application_zodvalidation_1.ApplicationZodValidationSchema.createApplicationValidationSchema), application_controller_1.createApplication);
route.get('/my-applications', (0, authValidation_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.hr), application_controller_1.getMyApplications);
route.get('/my-all-applications', (0, authValidation_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.hr), application_controller_1.getMyAllApplications);
// Get all applications for a job (admin only)
route.get('/:jobId', (0, authValidation_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.hr), application_controller_1.getAllJobsApplication);
route.delete('/:id', (0, authValidation_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.hr), application_controller_1.deleteJobApplication);
route.patch('/:id', (0, authValidation_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.hr), application_controller_1.updateJobApplication);
exports.ApplicationRoute = route;
