import { THR } from './hr.interface';
import { HRModel } from './hr.moduels';

const getAllHRFromDB = async () => {
  const result = await HRModel.find();
  return result;
};

const getSingleHRFromDB = async (id: string) => {
  const result = await HRModel.findById(id);
  return result;
};

const updateHRFromDB = async (id: string, payload: Partial<THR>) => {
  const result = await HRModel.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

const deleteHRFromDB = async (id: string) => {
  const result = await HRModel.findByIdAndDelete(id);
  return result;
};

export const HRService = {
  getAllHRFromDB,
  getSingleHRFromDB,
  updateHRFromDB,
  deleteHRFromDB,
};
