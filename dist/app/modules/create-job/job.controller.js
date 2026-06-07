"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const job_service_1 = require("./job.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const upload_service_1 = require("../upload/upload-service");
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = req.user;
    let logoUrl = '';
    if (req.file) {
        const result = yield (0, upload_service_1.uploadToCloudinary)(req.file.buffer);
        logoUrl = result.secure_url;
    }
    const salary = req.body.salary;
    const jobData = {
        title: req.body.title,
        location: req.body.location,
        workType: req.body.workType,
        employmentType: req.body.employmentType,
        experienceLevel: req.body.experienceLevel,
        description: req.body.description,
        applicationDeadline: req.body.applicationDeadline,
        status: req.body.status,
        company: {
            name: (_a = req.body.company) === null || _a === void 0 ? void 0 : _a.name,
            logo: logoUrl,
            website: (_b = req.body.company) === null || _b === void 0 ? void 0 : _b.website,
        },
        salary: {
            min: Number(salary.min),
            max: Number(salary.max),
            currency: salary.currency,
        },
        skills: Array.isArray(req.body.skills)
            ? req.body.skills.filter((s) => s.trim())
            : [],
        responsibilities: req.body.responsibilities || [],
        requirements: req.body.requirements || [],
        benefits: req.body.benefits || [],
        createdBy: user._id,
    };
    const result = yield job_service_1.JobServices.createJobIntoDB(jobData);
    return res.json({
        success: true,
        data: result,
    });
});
const getAllJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_service_1.JobServices.getAllJobsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Jobs retrieved successfully',
        data: result,
    });
});
const getHrAllJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // 🔥 FIXED (_id not id)
    const result = yield job_service_1.JobServices.getHrAllJobsFromDB(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Jobs retrieved successfully',
        data: result,
    });
});
const getSingleJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield job_service_1.JobServices.getSingleJobFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Job retrieved successfully',
        data: result,
    });
});
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield job_service_1.JobServices.deleteJobFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Job deleted successfully',
        data: result,
    });
});
const updateJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield job_service_1.JobServices.updateJobIntoDB(id, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Job updated successfully',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            success: false,
            message: 'Failed to update job',
            data: error,
        });
    }
});
exports.JobControllers = {
    createJob,
    getHrAllJobs,
    getAllJobs,
    getSingleJob,
    deleteJob,
    updateJob,
};
