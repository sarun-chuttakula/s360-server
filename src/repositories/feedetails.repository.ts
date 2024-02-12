import AppDataSource from "../configs/data-source";
import { Student, FeeDetails, User } from "../models";
import { INewFeeDetailsRequest, INewFeeDetailsResponse } from "../dtos";
const feeDetailsRepository = AppDataSource.manager.getRepository(FeeDetails);
const studentRepository = AppDataSource.manager.getRepository(Student);
export const createFeeDetails = async (
  payload: INewFeeDetailsRequest,
  reqUser: User
) => {
  const findstudent = await studentRepository.findOneBy({ ht_no: payload.ht_no })
  if (findstudent == null)
  throw new Error("student not found")
  const feedetails = new FeeDetails();
  await feeDetailsRepository.save({
    ...feedetails,
    ...payload,
    created_by: reqUser.id,
    updated_by: reqUser.id,
    created_at: new Date(),
    updated_at: new Date(),
    student: findstudent,
  })
  return { message: "succesful" }
}