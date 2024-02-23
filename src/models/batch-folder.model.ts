import { Entity, Column, OneToMany, Check } from "typeorm";
import { BaseEntityModel } from "./base.model";
@Entity("batchfolder")
@Check(`"is_deleted" = false`)
export class BatchFolder extends BaseEntityModel {
  @Column({ nullable: false })
  batch!: string;

  @Column({ nullable: false, type: "longtext" })
  folder!: string;
}
