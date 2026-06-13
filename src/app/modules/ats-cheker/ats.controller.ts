import { Request, Response } from 'express';
import { atsFromApplicationService } from './ats.service';
import { JobApplication } from '../application/application.modle';

export const analyzeApplicationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { applicationId } = req.params;

    // 1. get application from DB
    const application = await JobApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // 2. job description (assume populated or sent in body)
    const jobDescription = req.body.jobDescription;

    // 3. ATS analyze
    const result = await atsFromApplicationService(application, jobDescription);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
