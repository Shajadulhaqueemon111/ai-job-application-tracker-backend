"use strict";
// src/modules/job/job.route.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRoute = void 0;
const express_1 = __importDefault(require("express"));
const validationRequest_1 = __importDefault(require("../../middleware/validationRequest"));
const job_controller_1 = require("../create-job/job.controller");
const job_validationschema_1 = require("./job.validationschema");
const route = express_1.default.Router();
// ---------------- JOBS ----------------
route.get('/search', job_controller_1.searchJobs);
// List all jobs
route.get('/', job_controller_1.getAllJobs);
// Get single job details
route.get('/:id', job_controller_1.getSingleJob);
// Create a job (Admin only)
route.post('/create-job', 
//   authValidateRequest(USER_ROLE.admin, USER_ROLE.admin, USER_ROLE.user),
(0, validationRequest_1.default)(job_validationschema_1.JobZodValidationSchema.createJobValidationSchema), job_controller_1.createJob);
// Delete a job (Admin only)
route.delete('/:id', 
//   authValidateRequest(USER_ROLE.admin, USER_ROLE.admin, USER_ROLE.user),
job_controller_1.deleteJob);
// Submit a job application
route.post('/:jobId/applications', (0, validationRequest_1.default)(job_validationschema_1.JobZodValidationSchema.createApplicationValidationSchema), job_controller_1.createApplication);
// Get all applications for a specific job (Admin only)
route.get('/:jobId/applications', 
//   authValidateRequest(USER_ROLE.admin, USER_ROLE.admin, USER_ROLE.user),
job_controller_1.getApplicationsByJob);
exports.JobRoute = route;
