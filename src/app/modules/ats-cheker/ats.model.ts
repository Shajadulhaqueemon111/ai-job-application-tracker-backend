import mongoose from 'mongoose';

const AtsSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    resumeText: String,
    jobDescription: String,
    result: Object,
  },
  { timestamps: true },
);

export const AtsModel = mongoose.model('Ats', AtsSchema);
