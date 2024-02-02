import { Entity, Column, OneToMany, Check } from "typeorm";
import { Role } from "../enums";
import { BaseUser } from "./base-user.model";
@Entity("user")
@Check(`"is_deleted" = false`)
export class User extends BaseUser {
  @Column({ nullable: false })
  firstname!: string;

  @Column({ nullable: true, default: null })
  lastname!: string;

  @Column({ type: "enum", enum: Role, default: Role.teacher })
  role!: Role;

  @Column({ nullable: true, default: null })
  dob!: string;

  @Column({ nullable: true, default: null })
  gender!: string;

  @Column({ nullable: false, unique: true })
  username!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  lastlogin!: Date;

  @Column({ nullable: true, default: null })
  profile_pic!: string;
}
