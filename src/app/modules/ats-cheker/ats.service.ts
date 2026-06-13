import { GoogleGenerativeAI } from '@google/generative-ai';
import { extractResumeText } from './resume-parser-service';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const atsFromApplicationService = async (
  application: any,
  jobDescription: string,
) => {
  // 1. resume text extract
  const resumeText = await extractResumeText(application.resumeUrl);

  // 2. Gemini model
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  const prompt = `
You are an ATS expert.

Compare Resume with Job Description and return ONLY JSON.

Candidate Info:
Name: ${application.fullName}
Email: ${application.email}
Experience: ${application.experience}

Resume:
${resumeText}

Job Description:
${jobDescription}

Return format:
{
  "score": number (0-100),
  "matchedSkills": string[],
  "missingSkills": string[],
  "summary": string,
  "recommendation": string
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return JSON.parse(text);
};
