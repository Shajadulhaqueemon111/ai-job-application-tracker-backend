"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRoute = void 0;
const express_1 = __importDefault(require("express"));
const application_controller_1 = require("./application.controller");
const validationRequest_1 = __importDefault(require("../../middleware/validationRequest"));
const application_zodvalidation_1 = require("./application.zodvalidation");
const route = express_1.default.Router();
route.get('/', application_controller_1.getAllJobsApplication);
// Submit a job application
route.post('/', (0, validationRequest_1.default)(application_zodvalidation_1.ApplicationZodValidationSchema.createApplicationValidationSchema), application_controller_1.createApplication);
// Get all applications for a job (admin only)
route.get('/:jobId', 
// authValidateRequest(USER_ROLE.admin, USER_ROLE.admin),
application_controller_1.getApplicationsByJob);
route.delete('/:id', 
//   authValidateRequest(USER_ROLE.admin, USER_ROLE.admin, USER_ROLE.user),
application_controller_1.deleteJobApplication);
exports.ApplicationRoute = route;
