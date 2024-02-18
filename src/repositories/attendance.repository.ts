import AppDataSource from "../configs/data-source";
import { Attendance, User, Student } from "../models";
import {
  INewAttendanceRequest,
  INewAttendanceResponse,
  IAttendanceUpdateRequest,
  IAttendanceUpdateResponse,
  IGetAllStudentsResponse,
} from "../dtos";
import { MoreThanOrEqual } from "typeorm";
const attendanceRepository = AppDataSource.manager.getRepository(Attendance);
const studentRepository = AppDataSource.manager.getRepository(Student);
export const createAttendance = async (
  payload: INewAttendanceRequest[],
  reqUser: User
): Promise<INewAttendanceResponse> => {
  const missing = [];
  await Promise.all(
    payload.map(async (att) => {
      const findstudent = await studentRepository.findOne({
        where: { ht_no: att.ht_no },
      });
      if (!findstudent) {
        missing.push(att.ht_no);
      } else {
        const attendance = new Attendance();
        await attendanceRepository.save({
          ...attendance,
          attendance: att.attendance,
          created_by: reqUser.id,
          updated_by: reqUser.id,
          created_at: new Date(),
          updated_at: new Date(),
          student: findstudent,
        });
      }
    })
  );

  return { message: "succesful", missing: [] };
};

export const updateAttendance = async (
  payload: IAttendanceUpdateRequest[],
  reqUser: User
): Promise<IAttendanceUpdateResponse> => {
  await Promise.all(
    payload.map(async (att) => {
      const curr_date = new Date();
      curr_date.setUTCHours(0, 0, 0, 0);
      const preattendance = await attendanceRepository.findOne({
        where: {
          student: { ht_no: att.ht_no },
          created_at: MoreThanOrEqual(curr_date),
        },
      });
      if (preattendance != null) {
        await attendanceRepository.save({
          ...preattendance,
          attendance: att.attendance,
          updated_at: new Date(),
          updated_by: reqUser.id,
        });
      }
    })
  );
  return { message: "updated" };
};

export const getAllStudents = async (
  reqUser: User
): Promise<IGetAllStudentsResponse[]> => {
  const students = await studentRepository.find({
    where: { is_active: true, is_deleted: false },
  });
  //   students.forEach((student) => {
  //     student.id = student.id;
  //     student.email = student.email;
  //     student.phone = student.phone;
  //     student.firstname = student.firstname;
  //     student.lastname = student.lastname;
  //     student.dob = student.dob;
  //     student.gender = student.gender;
  //     student.ht_no = student.ht_no;
  //     student.lastlogin = student.lastlogin;
  //     student.profile_pic = student.profile_pic;
  //   });
  return students;
};
