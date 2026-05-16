"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModel = void 0;
const mongoose_1 = require("mongoose");
const companySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    logo: String,
    website: String,
});
const salarySchema = new mongoose_1.Schema({
    min: Number,
    max: Number,
    currency: {
        type: String,
        default: 'USD',
    },
});
const jobSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    company: {
        type: companySchema,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    workType: {
        type: String,
        enum: ['Remote', 'Hybrid', 'Onsite'],
        required: true,
    },
    employmentType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
        required: true,
    },
    experienceLevel: {
        type: String,
        enum: ['Junior', 'Mid', 'Senior'],
        required: true,
    },
    salary: salarySchema,
    skills: [String],
    description: String,
    responsibilities: [String],
    requirements: [String],
    benefits: [String],
    applicationDeadline: Date,
    totalApplicants: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'closed'],
        default: 'active',
    },
}, {
    timestamps: true,
});
exports.JobModel = (0, mongoose_1.model)('Job', jobSchema);
