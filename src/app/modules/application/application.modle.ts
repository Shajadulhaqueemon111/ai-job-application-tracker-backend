import { Schema, model } from 'mongoose';

const JobApplicationSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
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
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

export const JobApplication = model('JobApplication', JobApplicationSchema);
