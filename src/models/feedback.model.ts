import { Entity, Column, OneToMany, Check } from "typeorm";
import { BaseEntityModel } from "./base.model";
@Entity("feedback")
@Check(`"is_deleted" = false`)
export class Feedback extends BaseEntityModel {
  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false })
  description!: string;

  @Column({ nullable: true, default: null })
  image!: string;
}
