import AppDataSource from "../configs/data-source";
import { Attendance, User, Student } from "../models";
import { INewAttendanceRequest, INewAttendanceResponse, IAttendanceUpdateRequest, IAttendanceUpdateResponse } from "../dtos";
import { MoreThanOrEqual } from "typeorm";
const attendanceRepository = AppDataSource.manager.getRepository(Attendance);
const studentRepository = AppDataSource.manager.getRepository(Student);
export const createAttendance = async (
    payload: INewAttendanceRequest[],
    reqUser: User
): Promise<INewAttendanceResponse> => {
    const missing = []
    await Promise.all(payload.map(async (att) => {
        const findstudent = await studentRepository.findOneBy({ ht_no: att.ht_no });
        if (!findstudent) {
            missing.push(att.ht_no);
        } else {
            const attendance = new Attendance()
            await attendanceRepository.save({
                ...attendance,
                attendance: att.attendance,
                created_by: reqUser.id,
                updated_by: reqUser.id,
                created_at: new Date(),
                updated_at: new Date(),
                student: findstudent,
            })
        }
    }));

    return { message: "succesful", missing: [] }
    //   const newattendance = new Attendance();
    //   const Newattendance = await attendanceRepository.save({
    //     ...newattendance,
    //     ...payload,
    //     created_by: reqUser.id,
    //     updated_by: reqUser.id,
    //   });
    //   if (!Newattendance) throw new Error("attendance not created");
    //   const newattendanceMember = new attendanceMember();
    //   newattendanceMember.attendance = Newattendance;
    //   newattendanceMember.admin = reqUser;
    //   newattendanceMember.created_by = reqUser.id;
    //   newattendanceMember.updated_by = reqUser.id;
    //   await attendanceMemberRepository.save(newattendanceMember);
    //   return Newattendance;
};

export const updateAttendance = async (
    payload: IAttendanceUpdateRequest[],
    reqUser: User
): Promise<IAttendanceUpdateResponse> => {
    await Promise.all(payload.map(async (att) => {
        const curr_date = new Date();
        curr_date.setUTCHours(0, 0, 0, 0);
        const preattendance = await attendanceRepository.findOne({
            where: { student: { ht_no: att.ht_no }, created_at: MoreThanOrEqual(curr_date) }
        });
        if (preattendance != null) {
            await attendanceRepository.save({
                ...preattendance,
                attendance: att.attendance,
                updated_at: new Date(),
                updated_by: reqUser.id,
            });
        }
    }))
    return { message: "updated" }
}