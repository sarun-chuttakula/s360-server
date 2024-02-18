import { Entity, Column, OneToMany, Check } from "typeorm";
import { BaseEntityModel } from "./base.model";
@Entity("classes")
@Check(`"is_deleted" = false`)
export class Classes extends BaseEntityModel {
  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: true })
  year!: number;
}
