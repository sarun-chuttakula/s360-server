import { hallticket } from "../templets/hallticket";
import AppDataSource from "../configs/data-source";
import { FeeDetails, Student, User } from "../models";
const feeDetailsRepository = AppDataSource.manager.getRepository(FeeDetails);
const studentRepository = AppDataSource.manager.getRepository(Student);
export const getHallticket = async (
  reqUser: User
) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0)
  date.setMonth(0, 0)
  const student = await studentRepository.findOneBy({ id: reqUser.id })
  if (student == null)
    throw new Error("Student Not Found")
  const feedetails = await feeDetailsRepository.findOne({ where: { student: { id: student?.id, created_at: date } } })
  if (feedetails == null)
    throw new Error("FeePayment Not Done Yet");
  return hallticket({
    name: student.firstname + student.lastname,
    profile_pic: `http://localhost:3000/public/${student.profile_pic}`,
    ht_no: student.ht_no,
    gender: student.gender,
    date: date.toLocaleDateString(),
    year: date.getFullYear()
  });
}