import { Entity, Column, OneToMany, Check } from "typeorm";
import { Role } from "../enums";
import { BaseUser } from "./base-user.model";
@Entity("student")
@Check(`"is_deleted" = false`)
export class Student extends BaseUser {
  @Column({ nullable: false })
  firstname!: string;

  @Column({ nullable: true, default: null })
  lastname!: string;

  @Column({ nullable: true, default: null })
  dob!: string;

  @Column({ nullable: true, default: null })
  gender!: string;

  @Column({ nullable: false, unique: true })
  ht_no!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ nullable: false, default: Role.student })
  role!: Role;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  lastlogin!: Date;

  @Column({ nullable: true, default: null })
  profile_pic!: string;
}
