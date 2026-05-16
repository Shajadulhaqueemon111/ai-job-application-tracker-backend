import { Types } from 'mongoose';

export type THR = {
  name: string;
  email: string;

  user: Types.ObjectId;

  company: {
    name: string;
    logo?: string;
    website?: string;
  };

  isVerified?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
};
