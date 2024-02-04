import { Entity, Column, OneToMany, Check } from "typeorm";
import { BaseEntityModel } from "./base.model";
@Entity("chatgroup")
@Check(`"is_deleted" = false`)
export class Group extends BaseEntityModel {
  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  description!: string;

  @Column({ nullable: true, default: null })
  image!: string;
}
