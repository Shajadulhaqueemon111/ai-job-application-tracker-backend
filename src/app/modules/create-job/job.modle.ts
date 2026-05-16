import { Schema, model } from 'mongoose';
import { TJob } from './job.interface';

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  logo: String,
  website: String,
});

const salarySchema = new Schema({
  min: Number,
  max: Number,
  currency: {
    type: String,
    default: 'USD',
  },
});

const jobSchema = new Schema<TJob>(
  {
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
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

export const JobModel = model<TJob>('Job', jobSchema);
