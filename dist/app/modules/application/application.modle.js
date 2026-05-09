"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModel = void 0;
const mongoose_1 = require("mongoose");
const applicationSchema = new mongoose_1.Schema({
    jobId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Job', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    resumeLink: { type: String, required: true },
    coverNote: { type: String },
    createdAt: { type: Date, default: Date.now },
});
exports.ApplicationModel = mongoose_1.models.Application || (0, mongoose_1.model)('Application', applicationSchema);
