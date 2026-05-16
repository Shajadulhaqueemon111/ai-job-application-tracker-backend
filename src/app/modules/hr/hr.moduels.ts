import { Schema, model } from 'mongoose';
import { THR } from './hr.interface';

const companySchema = new Schema({
  name: { type: String, required: true },
  logo: String,
  website: String,
});

const hrSchema = new Schema<THR>(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },

    company: {
      type: companySchema,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const HRModel = model<THR>('HR', hrSchema);
