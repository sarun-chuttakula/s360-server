import AppDataSource from "../configs/data-source";
import { IClassesRequest } from "../dtos";
import { Day } from "../enums/day.enums";
import { Student, User } from "../models";
import { BatchFolder } from "../models/batch-folder.model";
import { Classes } from "../models/class.model";
import { Timetable } from "../models/timetable.model";
import { createFolder } from "./library.repository";
const batchRepository = AppDataSource.manager.getRepository(BatchFolder);
const classRepository = AppDataSource.manager.getRepository(Classes);
const studentRepository = AppDataSource.manager.getRepository(Student);
const userRepository = AppDataSource.manager.getRepository(User);
const timetableRepository = AppDataSource.manager.getRepository(Timetable);
export const createClass = async (payload: IClassesRequest, reqUser: User) => {
  const findclass = await classRepository.findOne({
    where: { name: payload.name },
  });
  if (findclass) throw new Error("class already exists");
  const currentYear = new Date().getFullYear();
  // const batchEnd = currentYear + 4;
  let batch = await batchRepository.findOne({
    where: {
      batch: `${currentYear}`,
    },
  });
  if (!batch) {
    await createFolder(`${currentYear}`);
    batch = await batchRepository.save({
      ...new BatchFolder(),
      batch: `${currentYear}`,
      folder: `${process.env.FOLDER_PATH}/${currentYear}`,
      created_by: "ADMIN",
      updated_by: "ADMIN",
    });
  }
  const newclass = new Classes();
  return await classRepository.save({
    ...newclass,
    ...payload,
    batchfolder: batch,
    created_by: reqUser.id,
    updated_by: reqUser.id,
  });
};

export const getAllClasses = async (
  reqUser: User | Student,
  classId: string
) => {
  if (classId) {
    const findclass = await classRepository.findOne({
      where: { id: classId },
    });
    if (!findclass) throw new Error("class not found");
    return findclass;
  } else {
    const classes = await classRepository.find({
      where: { is_active: true, is_deleted: false },
    });
    if (!classes) throw new Error("classes not found");
    return classes;
  }
};

export const getAllStudentsbyClass = async (
  reqUser: User | Student,
  classId: string
) => {
  const findclass = await classRepository.findOne({
    where: { id: classId },
  });
  if (!findclass) throw new Error("class not found");
  const students = await studentRepository.find({
    where: { is_active: true, is_deleted: false, class: findclass },
    relations: ["class"],
  });
  if (!students) throw new Error("students not found");
  students.forEach((student) => {
    student.ht_no = student.ht_no;
    student.firstname = student.firstname;
    student.gender = student.gender;
    student.class = student.class;
  });
  return students;
};

export const getTimetable = async (
  reqUser: User | Student,
  classId: string
): Promise<Record<string, any[]>> => {
  const findClass = await classRepository.findOne({
    where: { id: classId },
  });

  if (!findClass) throw new Error("Class not found");

  const timetable = await timetableRepository.find({
    where: { class: { id: classId }, is_active: true, is_deleted: false },
    relations: ["class"],
  });

  if (!timetable || timetable.length === 0)
    throw new Error("Timetable not found");

  const days: Record<Day, string> = {
    [Day.MONDAY]: "Monday",
    [Day.TUESDAY]: "Tuesday",
    [Day.WEDNESDAY]: "Wednesday",
    [Day.THURSDAY]: "Thursday",
    [Day.FRIDAY]: "Friday",
  };

  const groupedTimetable: Record<string, any[]> = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  };

  timetable.forEach((entry: Timetable) => {
    const day = days[entry.day];
    const sortedSchedule: any[] = [];
    Object.keys(entry.schedule).forEach((period: any) => {
      sortedSchedule.push({
        period,
        subject: entry.schedule[period].subject,
        teacher_id: entry.schedule[period].teacher_id,
        teacher_name: entry.schedule[period].teacher_name,
      });
    });
    groupedTimetable[day] = sortedSchedule;
  });

  return groupedTimetable;
};
