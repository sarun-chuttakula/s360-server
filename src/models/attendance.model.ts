import { Entity, Column, Check, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntityModel } from "./base.model";
import { Student } from "./student.model";
import { AttendanceEnum } from "../enums";
@Entity("attendance")
@Check(`"is_deleted" = false`)
export class Attendance extends BaseEntityModel {
    @Column()
    attendance!: AttendanceEnum;

    @ManyToOne(() => Student, (student) => student.id)
    @JoinColumn({ name: 'student_id' })
    student!: Student
}
