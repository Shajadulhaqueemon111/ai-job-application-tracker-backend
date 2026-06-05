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
exports.JobServices = void 0;
const soket_1 = require("../../utils/soket");
const notification_model_1 = require("../notification/notification.model");
const job_modle_1 = require("./job.modle");
const createJobIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_modle_1.JobModel.create(payload);
    // 🔥 save notification in DB
    const notification = yield notification_model_1.NotificationModel.create({
        userId: null,
        type: 'NEW_JOB',
        title: 'New Job Alert 🚀',
        message: `${result.title} job just posted`,
        read: false,
    });
    // 🔥 safe socket emit
    try {
        const io = (0, soket_1.getIO)();
        io.emit('notification', notification);
    }
    catch (error) {
        console.log('Socket not ready yet:",error');
    }
    return result;
});
const getAllJobsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_modle_1.JobModel.find();
    return result;
});
const getSingleJobFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_modle_1.JobModel.findById(id);
    return result;
});
const updateJobIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_modle_1.JobModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteJobFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_modle_1.JobModel.findByIdAndDelete(id);
    return result;
});
exports.JobServices = {
    createJobIntoDB,
    getAllJobsFromDB,
    getSingleJobFromDB,
    deleteJobFromDB,
    updateJobIntoDB,
};
