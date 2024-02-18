import AppDataSource from "../configs/data-source";
import { Student, FeeDetails, User } from "../models";
import { INewFeeDetailsRequest, INewFeeDetailsResponse } from "../dtos";
const feeDetailsRepository = AppDataSource.manager.getRepository(FeeDetails);
const studentRepository = AppDataSource.manager.getRepository(Student);
export const createFeeDetails = async (
  payload: INewFeeDetailsRequest,
  reqUser: User
) => {
  const findstudent = await studentRepository.findOne({
    where: { ht_no: payload.ht_no },
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

export const getFeeDetails = async (reqUser: User | Student, id?: string) => {
  if (id) {
    const student = await studentRepository.findOne({
      where: { ht_no: id },
    });
    if (!student) throw new Error("student not found");
    const feedetails = await feeDetailsRepository.find({
      where: { is_active: true, is_deleted: false },
      relations: ["student"],
    });
    if (!feedetails) throw new Error("feedetails not found");
    feedetails.forEach((feedetail) => {
      feedetail.student = feedetail.student;
      feedetail.amount = feedetail.amount;
      feedetail.transaction_id = feedetail.transaction_id;
      feedetail.is_paid = feedetail.is_paid;
      feedetail.payment_date = feedetail.payment_date;
    });
    return feedetails;
  } else {
    const feedetails = await feeDetailsRepository.find({
      where: { is_active: true, is_deleted: false },
    });
    if (!feedetails) throw new Error("feedetails not found");
    feedetails.forEach((feedetail) => {
      feedetail.student = feedetail.student;
      feedetail.amount = feedetail.amount;
      feedetail.transaction_id = feedetail.transaction_id;
      feedetail.is_paid = feedetail.is_paid;
      feedetail.payment_date = feedetail.payment_date;
    });
    return feedetails;
  }
};
