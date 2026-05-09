import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminService } from './admin.service';
import httpStatus from 'http-status';
export const getAllAdmin = catchAsync(async (req, res) => {
  const result = await AdminService.getAllAdminIntoDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'retrive admin data successfully',
    data: result,
  });
});
export const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.getSingleAdminIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'retrive admin data successfully',
    data: result,
  });
});
export const updateAdmin = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const payload = req.body;
  const result = await AdminService.updateAdminIntoDB(_id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'update admin data successfully',
    data: result,
  });
});
export const deleteAdmin = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const result = await AdminService.deleteAdminIntoDB(_id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'admin deleted successfully',
    data: result,
  });
});
