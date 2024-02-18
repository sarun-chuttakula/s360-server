import AppDataSource from "../configs/data-source";
import { IClassesRequest } from "../dtos";
import { Day } from "../enums/day.enums";
import { Student, User } from "../models";
import { Classes } from "../models/class.model";
import { Timetable } from "../models/timetable.model";

const classRepository = AppDataSource.manager.getRepository(Classes);
const studentRepository = AppDataSource.manager.getRepository(Student);
const userRepository = AppDataSource.manager.getRepository(User);
const timetableRepository = AppDataSource.manager.getRepository(Timetable);
export const createClass = async (payload: IClassesRequest, reqUser: User) => {
  const findclass = await classRepository.findOne({
    where: { name: payload.name },
  });
  if (findclass) throw new Error("class already exists");
  const newclass = new Classes();
  return await classRepository.save({
    ...newclass,
    ...payload,
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
) => {
  const findClass = await classRepository.findOne({
    where: { id: classId },
  });

  if (!findClass) throw new Error("Class not found");

  const timetable = await timetableRepository.find({
    where: { is_active: true, is_deleted: false },
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
    [Day.SATURDAY]: "Saturday",
    [Day.SUNDAY]: "Sunday",
  };

  // Initialize an object to store timetable entries grouped by day
  const groupedTimetable: Record<string, any[]> = {};

  timetable.forEach((entry) => {
    const day = days[entry.day];
    if (!groupedTimetable[day]) {
      groupedTimetable[day] = [];
    }

    groupedTimetable[day].push({
      start_time: entry.start_time,
      end_time: entry.end_time,
      subject: entry.subject,
    });
  });

  return groupedTimetable;
};
