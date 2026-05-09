import { TAdmin } from './admin.interface';
import AdminModle from './admin.modle';

const getAllAdminIntoDB = async () => {
  const result = await AdminModle.find();

  return result;
};

const getSingleAdminIntoDB = async (_id: string) => {
  const result = await AdminModle.findById(_id);
  return result;
};

const updateAdminIntoDB = async (_id: string, payload: Partial<TAdmin>) => {
  const result = await AdminModle.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteAdminIntoDB = async (_id: string) => {
  const result = await AdminModle.findByIdAndDelete(_id);
};
export const AdminService = {
  getAllAdminIntoDB,
  getSingleAdminIntoDB,
  updateAdminIntoDB,
  deleteAdminIntoDB,
};
