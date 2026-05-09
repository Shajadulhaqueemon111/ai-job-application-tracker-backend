"use strict";
// src/modules/job/job.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModel = exports.JobModel = void 0;
const mongoose_1 = require("mongoose");
// Job Schema
const jobSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
// Application Schema
const applicationSchema = new mongoose_1.Schema({
    jobId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Job', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    resumeLink: { type: String, required: true },
    coverNote: { type: String },
    createdAt: { type: Date, default: Date.now },
});
exports.JobModel = (0, mongoose_1.model)('Job', jobSchema);
exports.ApplicationModel = (0, mongoose_1.model)('Application', applicationSchema);
