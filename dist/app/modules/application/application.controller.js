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
exports.getSingleJobApplication = exports.updateJobApplication = exports.deleteJobApplication = exports.getAllJobsApplication = exports.getMyAllApplications = exports.getMyApplications = exports.createApplication = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const application_service_1 = require("./application.service");
const resumi_cloudinary_upload_1 = require("./resumi-cloudinary-upload");
// Global Job Search
// Submit application
// export const createApplication = catchAsync(async (req, res) => {
//   const payload = req.body;
//   const result = await createApplicationInDB(payload);
//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: 'Application submitted successfully',
//     data: result,
//   });
// });
const createApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        throw new Error('Resume file is required');
    }
    // 🔥 upload to cloudinary
    const uploaded = yield (0, resumi_cloudinary_upload_1.uploadToCloudinary)(file);
    const user = req.user;
    const payload = Object.assign(Object.assign({}, req.body), { userId: user._id, resumeUrl: uploaded.secure_url });
    const result = yield (0, application_service_1.createApplicationInDB)(payload);
    res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        data: result,
    });
});
exports.createApplication = createApplication;
exports.getMyApplications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    const result = yield (0, application_service_1.getUserApplicationsFromDB)(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'My applications retrieved successfully',
        data: result,
    });
}));
exports.getMyAllApplications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    const result = yield (0, application_service_1.getMyApplicationsFromDB)(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'My applications retrieved successfully',
        data: result,
    });
}));
exports.getAllJobsApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, application_service_1.getAllJobsApplicationFromDB)(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Jobs Application retrieved successfully',
        data: result,
    });
}));
exports.deleteJobApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, application_service_1.deleteJobApplicationInDB)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Job deleted successfully',
        data: result,
    });
}));
exports.updateJobApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const result = yield (0, application_service_1.updateApplicationInDB)(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Job updated successfully',
        data: result,
    });
}));
exports.getSingleJobApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, application_service_1.getSingleApplicationFromDB)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Job application retrieved successfully',
        data: result,
    });
}));
// Get applications by job
