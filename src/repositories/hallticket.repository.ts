import { hallticket } from "../templets/hallticket";
import AppDataSource from "../configs/data-source";
import { FeeDetails, Student, User } from "../models";
import { Result } from "../models/result.model";

const feeDetailsRepository = AppDataSource.manager.getRepository(FeeDetails);
const studentRepository = AppDataSource.manager.getRepository(Student);
const resultRepository = AppDataSource.manager.getRepository(Result);
export const getHallticket = async (reqUser: Student) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setMonth(0, 0);

  try {
    const student = await studentRepository.findOne({
      where: { id: reqUser.id },
    });

    if (!student) throw new Error("Student Not Found");

    const feedetails = await feeDetailsRepository.findOne({
      where: { student: { id: student.id } },
    });

    if (!feedetails) throw new Error("FeePayment Not Done Yet");

    return hallticket({
      name: student.firstname + " " + student.lastname, // Added a space between first and last name
      profile_pic: `http://localhost:3000/public/${student.profile_pic}`,
      ht_no: student.ht_no,
      gender: student.gender,
      date: date.toLocaleDateString(),
      year: date.getFullYear(),
    });
  } catch (error: any) {
    throw new Error(`Error generating hall ticket: ${error.message}`);
  }
};

export const getResultbyHallticket = async (
  ht_no: string,
  semester: string,
  reqUser: Student | User
) => {
  const student = await studentRepository.findOne({
    where: { ht_no: ht_no },
  });
  if (!student) throw new Error("Student Not Found");
  const result = await resultRepository.find({
    where: { student: student, semester: Number(semester) },
    relations: ["student"],
  });
  if (!result) throw new Error("Result Not Found");
  result.forEach((res) => {
    res.student.ht_no = res.student.ht_no;
    res.student.firstname = res.student.firstname;
    res.student.lastname = res.student.lastname;
    res.subject = res.subject;
    res.marks = res.marks;
    res.grade = res.grade;
    res.status = res.status;
  });
  return result;
};
