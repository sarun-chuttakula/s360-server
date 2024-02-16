import { Entity, Column, Check, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntityModel } from "./base.model";
import { Student } from "./student.model";
@Entity("feedetails")
@Check(`"is_deleted" = false`)
export class FeeDetails extends BaseEntityModel {
  @Column()
  amount!:number

  @Column()
  t_id!:string

  @ManyToOne(() => Student, (student) => student.id)
  @JoinColumn({ name: 'student_id' })
  student!: Student
}
