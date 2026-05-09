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
exports.getApplicationsByJobFromDB = exports.deleteJobApplicationInDB = exports.getAllJobsApplicationFromDB = exports.createApplicationInDB = void 0;
const application_modle_1 = require("./application.modle");
// Create a new application
const createApplicationInDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const application = new application_modle_1.ApplicationModel(data);
    return yield application.save();
});
exports.createApplicationInDB = createApplicationInDB;
const getAllJobsApplicationFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield application_modle_1.ApplicationModel.find().sort({ createdAt: -1 });
});
exports.getAllJobsApplicationFromDB = getAllJobsApplicationFromDB;
const deleteJobApplicationInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield application_modle_1.ApplicationModel.findByIdAndDelete(id);
});
exports.deleteJobApplicationInDB = deleteJobApplicationInDB;
// Get all applications for a job
const getApplicationsByJobFromDB = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield application_modle_1.ApplicationModel.find({ jobId });
});
exports.getApplicationsByJobFromDB = getApplicationsByJobFromDB;
