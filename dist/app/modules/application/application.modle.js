"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplication = void 0;
const mongoose_1 = require("mongoose");
const JobApplicationSchema = new mongoose_1.Schema({
    jobId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
    },
    linkedin: {
        type: String,
    },
    portfolio: {
        type: String,
    },
    experience: {
        type: String,
        required: true,
    },
    coverLetter: {
        type: String,
        required: true,
    },
    resumeUrl: {
        type: String,
        required: true,
    },
    agreement: {
        type: Boolean,
        required: true,
        default: false,
    },
    status: {
        type: String,
        enum: [
            'pending',
            'in_review',
            'shortlisted',
            'interviewed',
            'offered',
            'hired',
            'rejected',
        ],
        default: 'pending',
    },
}, { timestamps: true });
exports.JobApplication = (0, mongoose_1.model)('JobApplication', JobApplicationSchema);
