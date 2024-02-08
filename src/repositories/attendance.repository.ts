import AppDataSource from "../configs/data-source";
import { Attendance } from "../models/attendance.model";
import { Student } from "../models/student.model";
import { INewAttendanceRequest, INewAttendanceResponse } from "../dtos";
import { User } from "../models";
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

// export const getAllattendances = async () => {
//   const attendances = await attendanceRepository.find();
//   return attendances;
// };

// export const getattendanceById = async (id: string) => {
//   const attendance = await attendanceRepository.findOne({ where: { id: id } });
//   return attendance;
// };

// export const updateattendance = async (id: string, payload: INewattendanceRequest) => {
//   const attendance = await attendanceRepository.findOne({ where: { id: id } });
//   if (!attendance) {
//     return null;
//   }
//   const updatedattendance = await attendanceRepository.save({
//     ...attendance,
//     ...payload,
//   });
//   return updatedattendance;
// };

// export const deleteattendance = async (id: string) => {
//   const attendance = await attendanceRepository.findOne({ where: { id: id } });
//   if (!attendance) {
//     return null;
//   }
//   const deletedattendance = await attendanceRepository.delete(id);
//   return deletedattendance;
// };

// export const addMemberToattendance = async (
//   attendanceId: string,
//   userId: string,
//   reqUser: User
// ) => {
//   const attendance = await attendanceRepository.findOne({ where: { id: attendanceId } });
//   if (!attendance) {
//     throw new Error("attendance not found");
//   }
//   const newUser = await userRepository.findOne({ where: { id: userId } });
//   if (!newUser) throw new Error("User not found");
//   const newattendanceMember = new attendanceMember();
//   newattendanceMember.attendance = attendance;
//   newattendanceMember.admin = reqUser;
//   newattendanceMember.user = newUser;
//   await attendanceMemberRepository.save(newattendanceMember);
//   return newattendanceMember;
// };

// export const removeMemberFromattendance = async (
//   attendanceId: string,
//   userId: string
// ) => {
//   const attendance = await attendanceRepository.findOne({ where: { id: attendanceId } });
//   if (!attendance) {
//     throw new Error("attendance not found");
//   }
//   const user = await userRepository.findOne({ where: { id: userId } });
//   if (!user) throw new Error("User not found");
//   const attendanceMember = await attendanceMemberRepository.findOne({
//     where: { attendance: attendance, user: user },
//   });
//   if (!attendanceMember) throw new Error("User not found in attendance");
//   const deletedattendanceMember = await attendanceMemberRepository.delete(attendanceMember.id);
//   return deletedattendanceMember;
// };

// export const getattendanceMembers = async (attendanceId: string) => {
//   const attendance = await attendanceRepository.findOne({ where: { id: attendanceId } });
//   if (!attendance) {
//     throw new Error("attendance not found");
//   }
//   const attendanceMembers = await attendanceMemberRepository.find({
//     where: { attendance: attendance },
//   });
//   return attendanceMembers;
// };

// export const updateRoleInattendance = async (
//   attendanceId: string,
//   userId: string,
//   isadmin: boolean
// ) => {
//   const attendance = await attendanceRepository.findOne({ where: { id: attendanceId } });
//   if (!attendance) {
//     throw new Error("attendance not found");
//   }
//   const user = await userRepository.findOne({ where: { id: userId } });
//   if (!user) throw new Error("User not found");
//   const attendanceMember = await attendanceMemberRepository.findOne({
//     where: { attendance: attendance, user: user },
//   });
//   if (!attendanceMember) throw new Error("User not found in attendance");
//   if (isadmin) attendanceMember.admin = user;
//   else attendanceMember.user = user;
//   const updatedattendanceMember = await attendanceMemberRepository.save(attendanceMember);
//   return updatedattendanceMember;
// };
