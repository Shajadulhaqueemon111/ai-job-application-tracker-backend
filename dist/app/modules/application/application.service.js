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
exports.getSingleApplicationFromDB = exports.getMyApplicationsFromDB = exports.getUserApplicationsFromDB = exports.updateApplicationInDB = exports.deleteApplicationFromDB = exports.getAllJobsApplicationFromDB = exports.createApplicationInDB = void 0;
const soket_1 = require("../../utils/soket");
const job_modle_1 = require("../create-job/job.modle");
const notification_model_1 = require("../notification/notification.model");
const application_modle_1 = require("./application.modle");
// Create a new application
const createApplicationInDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingApplication = yield application_modle_1.JobApplication.findOne({
        jobId: data.jobId,
        email: data.email,
        userId: data.userId,
    });
    if (existingApplication) {
        throw new Error('You have already applied for this job');
    }
    const application = yield application_modle_1.JobApplication.create(data);
    // 🔥 get job with HR
    const job = yield job_modle_1.JobModel.findById(data.jobId);
    if (job) {
        yield job_modle_1.JobModel.findByIdAndUpdate(data.jobId, {
            $inc: { totalApplicants: 1 },
        });
        // 🔥 notify HR (IMPORTANT PART)
        yield notification_model_1.NotificationModel.create({
            userId: job.createdBy, // 👈 HR ID
            title: 'New Job Application',
            message: `${data.fullName} applied to your job: ${job.title}`,
            type: 'APPLICATION',
            read: false,
        });
    }
    return application.toObject();
});
exports.createApplicationInDB = createApplicationInDB;
const getAllJobsApplicationFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, hrId, userId, jobId, search, status } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = {};
    // 🔥 HR wise filter (IMPORTANT)
    if (hrId) {
        // HR → job relation
        const jobs = yield job_modle_1.JobModel.find({ createdBy: hrId }).select('_id');
        const jobIds = jobs.map((j) => j._id);
        filter.jobId = { $in: jobIds };
    }
    if (userId)
        filter.userId = userId;
    if (jobId)
        filter.jobId = jobId;
    if (status)
        filter.status = status;
    // 🔥 search (name/email/phone)
    if (search) {
        filter.$or = [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
        ];
    }
    const data = yield application_modle_1.JobApplication.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('jobId', 'title company location salary jobType')
        .lean();
    const total = yield application_modle_1.JobApplication.countDocuments(filter);
    return {
        data,
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
    };
});
exports.getAllJobsApplicationFromDB = getAllJobsApplicationFromDB;
const deleteApplicationFromDB = (applicationId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield application_modle_1.JobApplication.findById(applicationId);
    if (!application)
        throw new Error('Application not found');
    yield application_modle_1.JobApplication.findByIdAndDelete(applicationId);
    yield job_modle_1.JobModel.findByIdAndUpdate(application.jobId, {
        $inc: { totalApplicants: -1 },
    });
    return { message: 'Application deleted successfully' };
});
exports.deleteApplicationFromDB = deleteApplicationFromDB;
const updateApplicationInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const application = yield application_modle_1.JobApplication.findById(id);
    if (!application) {
        throw new Error('Application not found');
    }
    const updatedApplication = yield application_modle_1.JobApplication.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    })
        .populate('userId')
        .populate('jobId')
        .lean(); // 🔥 important for clean object
    if (!(updatedApplication === null || updatedApplication === void 0 ? void 0 : updatedApplication.userId))
        return;
    // ----------------------------
    // ✅ Create Notification (SAFE)
    // ----------------------------
    const notification = yield notification_model_1.NotificationModel.create({
        userId: ((_a = updatedApplication.userId) === null || _a === void 0 ? void 0 : _a._id) || updatedApplication.userId,
        type: 'APPLICATION_STATUS_UPDATED',
        title: 'Application Status Updated',
        message: `Your application for ${((_b = updatedApplication.jobId) === null || _b === void 0 ? void 0 : _b.title) || 'a job'} has been updated to ${updatedApplication.status}`,
        read: false,
    });
    // ----------------------------
    // ✅ Socket Emit (SAFE)
    // ----------------------------
    try {
        const io = (0, soket_1.getIO)();
        io.to((_c = updatedApplication.userId) === null || _c === void 0 ? void 0 : _c.toString()).emit('notification', notification);
    }
    catch (error) {
        console.log('Socket not ready yet:', error);
    }
    return updatedApplication;
});
exports.updateApplicationInDB = updateApplicationInDB;
const getUserApplicationsFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield application_modle_1.JobApplication.find({ userId }).lean();
});
exports.getUserApplicationsFromDB = getUserApplicationsFromDB;
const getMyApplicationsFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield application_modle_1.JobApplication.find({ userId })
        .populate('jobId', 'title company location salary jobType')
        .sort({ createdAt: -1 })
        .lean();
});
exports.getMyApplicationsFromDB = getMyApplicationsFromDB;
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
