import { Types } from 'mongoose';

export interface TCompany {
  name: string;
  logo?: string;
  website?: string;
}

export interface TSalary {
  min: number;
  max: number;
  currency: string;
}

export interface TJob {
  title: string;

  company: TCompany;

  location: string;

  workType: 'Remote' | 'Hybrid' | 'Onsite';

  employmentType: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';

  experienceLevel: 'Junior' | 'Mid' | 'Senior';

  salary: TSalary;

  skills: string[];

  description: string;

  responsibilities: string[];

  requirements: string[];

  benefits?: string[];

  applicationDeadline: Date;

  totalApplicants?: number;

  createdBy: Types.ObjectId;

  status: 'active' | 'closed';
}
