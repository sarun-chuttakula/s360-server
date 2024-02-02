import { Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntityModel } from "./base.model";

export class BaseUser extends BaseEntityModel {
  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true, default: null })
  phone!: string;
}
