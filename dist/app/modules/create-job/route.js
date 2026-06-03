"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationRequest_1 = __importDefault(require("../../middleware/validationRequest"));
const authValidation_1 = __importDefault(require("../../middleware/authValidation"));
const job_controller_1 = require("./job.controller");
const job_validationschema_1 = require("./job.validationschema");
const user_constant_1 = require("../user/user.constant");
const upload_1 = require("../../middleware/upload");
const router = express_1.default.Router();
// ---------------- CREATE JOB ----------------
router.post('/create-job', (0, authValidation_1.default)(user_constant_1.USER_ROLE.hr), upload_1.upload.single('logo'), (req, res, next) => {
    console.log('BODY:', req.body); // 🔥 DEBUG
    next();
}, (0, validationRequest_1.default)(job_validationschema_1.JobZodValidationSchema.createJobValidationSchema), job_controller_1.JobControllers.createJob);
// ---------------- GET ALL JOBS ----------------
router.get('/', (0, authValidation_1.default)(user_constant_1.USER_ROLE.hr, user_constant_1.USER_ROLE.user), job_controller_1.JobControllers.getAllJobs);
// ---------------- GET SINGLE JOB ----------------
router.get('/:id', (0, authValidation_1.default)(user_constant_1.USER_ROLE.hr, user_constant_1.USER_ROLE.user), job_controller_1.JobControllers.getSingleJob);
router.patch('/:id', (0, authValidation_1.default)(user_constant_1.USER_ROLE.hr), (0, validationRequest_1.default)(job_validationschema_1.JobZodValidationSchema.createJobValidationSchema), job_controller_1.JobControllers.updateJob);
// ---------------- DELETE JOB ----------------
router.delete('/:id', (0, authValidation_1.default)(user_constant_1.USER_ROLE.hr), job_controller_1.JobControllers.deleteJob);
exports.JobRoutes = router;
