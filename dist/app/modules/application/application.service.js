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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleApplicationFromDB = exports.getUserApplicationsFromDB = exports.updateApplicationInDB = exports.deleteJobApplicationInDB = exports.getAllJobsApplicationFromDB = exports.createApplicationInDB = void 0;
const job_modle_1 = require("../create-job/job.modle");
const application_modle_1 = require("./application.modle");
// Create a new application
const createApplicationInDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingApplication = yield application_modle_1.JobApplication.findOne({
        jobId: data.jobId,
        email: data.email,
    });
    if (existingApplication) {
        throw new Error('You have already applied for this job');
    }
    const application = yield application_modle_1.JobApplication.create(data);
    yield job_modle_1.JobModel.findByIdAndUpdate(data.jobId, {
        $inc: { totalApplicants: 1 },
    });
    return application.toObject();
});
exports.createApplicationInDB = createApplicationInDB;
const getAllJobsApplicationFromDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return yield application_modle_1.JobApplication.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
});
exports.getAllJobsApplicationFromDB = getAllJobsApplicationFromDB;
const deleteJobApplicationInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield application_modle_1.JobApplication.findById(id);
    if (!application) {
        throw new Error('Application not found');
    }
    yield job_modle_1.JobModel.findByIdAndUpdate(application.jobId, {
        $inc: { applicationCount: -1 },
    });
    return yield application_modle_1.JobApplication.findByIdAndDelete(id);
});
exports.deleteJobApplicationInDB = deleteJobApplicationInDB;
const updateApplicationInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield application_modle_1.JobApplication.findById(id);
    if (!application) {
        throw new Error('Application not found');
    }
    const updatedApplication = yield application_modle_1.JobApplication.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return updatedApplication;
});
exports.updateApplicationInDB = updateApplicationInDB;
const getUserApplicationsFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield application_modle_1.JobApplication.find({ email }).lean();
});
exports.getUserApplicationsFromDB = getUserApplicationsFromDB;
// Get a single application by ID
const getSingleApplicationFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield application_modle_1.JobApplication.findById(id)
        .populate('jobId', 'title company location')
        .lean();
    if (!application) {
        throw new Error('Application not found');
    }
    return application;
});
exports.getSingleApplicationFromDB = getSingleApplicationFromDB;
