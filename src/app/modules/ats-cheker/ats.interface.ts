export interface IResumeData {
  name?: string;
  email?: string;
  phone?: string;
  resumeText: string;
  jobDescription: string;
}

export interface IAtsResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
  suggestion: string;
}
