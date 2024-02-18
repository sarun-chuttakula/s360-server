import AppDataSource from "../configs/data-source";
import { Attendance, User, Student } from "../models";
import {
  INewAttendanceRequest,
  INewAttendanceResponse,
  IAttendanceUpdateRequest,
  IAttendanceUpdateResponse,
  IGetAllStudentsResponse,
} from "../dtos";
import { Between, MoreThanOrEqual } from "typeorm";
import { AttendanceEnum } from "../enums";
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

export const attendanceGraph = async (
  studentId: string,
  aggregator: string,
  startDate: string,
  endDate?: string
): Promise<any> => {
  const dayfrom = new Date(startDate);
  const dayto = endDate ? new Date(endDate) : new Date();
  let totalpresent = 0;
  let totalabsent = 0;
  let totalsenddata = [];
  switch (aggregator) {
    case "week":
      const endOfWeek = new Date(endDate || Date.now());
      endOfWeek.setDate(endOfWeek.getDate() + 1);
      const startOfWeek = new Date(endOfWeek);
      for (let day = 0; day < 7; day++) {
        let isPresent: boolean = false;
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + day);
        const present = await attendanceRepository.count({
          where: {
            attendance: AttendanceEnum.PRESENT,
            created_at: Between(startOfWeek, endOfWeek),
          },
          relations: ["student"],
        });
        const absent = await attendanceRepository.count({
          where: {
            attendance: AttendanceEnum.ABSENT,
            created_at: Between(startOfWeek, endOfWeek),
          },
          relations: ["student"],
        });
        totalpresent += present;
        totalabsent += absent;
        totalsenddata.push({
          date: `${currentDate.getDate()}/${
            currentDate.getMonth() + 1
          }/${currentDate.getFullYear()}`,
          present: isPresent ? present + 1 : present,
        });
      }
      return totalsenddata;

    case "month":
      // Similar query as above but grouping by month
      return await attendanceRepository
        .createQueryBuilder("attendance")
        .select("MONTH(attendance.created_at) as month")
        .addSelect(
          "SUM(CASE WHEN attendance.attendance = 'PRESENT' THEN 1 ELSE 0 END) as presentCount"
        )
        .addSelect(
          "SUM(CASE WHEN attendance.attendance = 'ABSENT' THEN 1 ELSE 0 END) as absentCount"
        )
        .where("attendance.student = :studentId", { studentId })
        .andWhere("attendance.created_at >= :startDate", { startDate: dayfrom })
        .andWhere("attendance.created_at <= :endDate", { endDate: dayto })
        .groupBy("MONTH(attendance.created_at)")
        .getRawMany();

    case "year":
      // Similar query as above but grouping by year
      return await attendanceRepository
        .createQueryBuilder("attendance")
        .select("YEAR(attendance.created_at) as year")
        .addSelect(
          "SUM(CASE WHEN attendance.attendance = 'PRESENT' THEN 1 ELSE 0 END) as presentCount"
        )
        .addSelect(
          "SUM(CASE WHEN attendance.attendance = 'ABSENT' THEN 1 ELSE 0 END) as absentCount"
        )
        .where("attendance.student = :studentId", { studentId })
        .andWhere("attendance.created_at >= :startDate", { startDate: dayfrom })
        .andWhere("attendance.created_at <= :endDate", { endDate: dayto })
        .groupBy("YEAR(attendance.created_at)")
        .getRawMany();

    default:
      throw new Error("Invalid aggregator");
  }
};
