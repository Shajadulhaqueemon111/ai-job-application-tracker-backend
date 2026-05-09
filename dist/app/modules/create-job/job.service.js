"use strict";
// src/modules/job/job.service.ts
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
exports.getApplicationsByJobFromDB = exports.createApplicationInDB = exports.deleteJobInDB = exports.createJobInDB = exports.getSingleJobFromDB = exports.getAllJobsFromDB = exports.searchJobsInDB = void 0;
const job_modle_1 = require("./job.modle");
// JOBS
const searchJobsInDB = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, category, location } = params;
    const filter = {};
    if (search) {
        filter.title = { $regex: search, $options: 'i' }; // case-insensitive search
    }
    if (category) {
        filter.category = category;
    }
    if (location) {
        filter.location = location;
    }
    return yield job_modle_1.JobModel.find(filter).sort({ createdAt: -1 });
});
exports.searchJobsInDB = searchJobsInDB;
const getAllJobsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield job_modle_1.JobModel.find().sort({ createdAt: -1 });
});
exports.getAllJobsFromDB = getAllJobsFromDB;
const getSingleJobFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield job_modle_1.JobModel.findById(id);
});
exports.getSingleJobFromDB = getSingleJobFromDB;
const createJobInDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const job = new job_modle_1.JobModel(data);
    return yield job.save();
});
exports.createJobInDB = createJobInDB;
const deleteJobInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield job_modle_1.JobModel.findByIdAndDelete(id);
});
exports.deleteJobInDB = deleteJobInDB;
// APPLICATIONS
const createApplicationInDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const application = new job_modle_1.ApplicationModel(data);
    return yield application.save();
});
exports.createApplicationInDB = createApplicationInDB;
const getApplicationsByJobFromDB = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield job_modle_1.ApplicationModel.find({ jobId });
});
exports.getApplicationsByJobFromDB = getApplicationsByJobFromDB;
