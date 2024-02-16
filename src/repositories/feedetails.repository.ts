import AppDataSource from "../configs/data-source";
import { Student, FeeDetails, User } from "../models";
import { INewFeeDetailsRequest, INewFeeDetailsResponse } from "../dtos";
const feeDetailsRepository = AppDataSource.manager.getRepository(FeeDetails);
const studentRepository = AppDataSource.manager.getRepository(Student);
export const createFeeDetails = async (
  payload: INewFeeDetailsRequest,
  reqUser: User
) => {
  const findstudent = await studentRepository.findOneBy({
    ht_no: payload.ht_no,
  });
  if (!findstudent) throw new Error("student not found");
  const feedetails = new FeeDetails();
  return await feeDetailsRepository.save({
    ...feedetails,
    ...payload,
    created_by: reqUser.id,
    updated_by: reqUser.id,
    student: findstudent,
  });
};

export const getFeeDetails = async (id: string) => {
  const student = await studentRepository.findOne({
    where: { ht_no: id },
  });
  if (!student) throw new Error("student not found");
  const feedetails = await feeDetailsRepository.findOne({
    where: { student: student },
  });
  if (!feedetails) throw new Error("feedetails not found");
  return feedetails;
};
