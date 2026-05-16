import { Request, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { HRService } from './hr.service';

// const createHR = async (req: Request, res: Response) => {
//   const result = await HRService.createHRIntoDB(req.body);

//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: 'HR created successfully',
//     data: result,
//   });
// };

const getAllHR = async (req: Request, res: Response) => {
  const result = await HRService.getAllHRFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HR list retrieved',
    data: result,
  });
};

const getSingleHR = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await HRService.getSingleHRFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HR retrieved',
    data: result,
  });
};

const updateHR = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await HRService.updateHRFromDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HR updated successfully',
    data: result,
  });
};

const deleteHR = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await HRService.deleteHRFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HR deleted successfully',
    data: result,
  });
};

export const HRController = {
  getAllHR,
  getSingleHR,
  updateHR,
  deleteHR,
};
