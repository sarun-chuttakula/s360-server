import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntityModel } from "./base.model";
import { User } from "./user.model"; // Import the User model

@Entity("teacher_subject")
export class TeacherSubject extends BaseEntityModel {
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "teacher_id" })
  teacher!: User;

  @Column({ nullable: false })
  subject!: string;
}
