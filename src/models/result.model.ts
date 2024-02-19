import { Entity, Column, OneToMany, Check, ManyToOne } from "typeorm";
import { BaseEntityModel } from "./base.model";
import { Student } from "./student.model";
@Entity("result")
@Check(`"is_deleted" = false`)
export class Result extends BaseEntityModel {
  @Column({ nullable: false })
  semester!: number;

  @Column({ nullable: false })
  subject!: string;

  @Column({ nullable: false })
  marks!: string;

  @Column({ nullable: false })
  grade!: string;

  @Column({ nullable: false })
  status!: string;

  @ManyToOne(() => Student, (student) => student.ht_no)
  student!: Student;
}
