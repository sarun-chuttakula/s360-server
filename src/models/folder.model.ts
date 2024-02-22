import {
  Entity,
  Column,
  Check,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { BaseEntityModel } from "./base.model";
import { Classes } from "./class.model";
@Entity("folder")
@Check(`"is_deleted" = false`)
export class Attendance extends BaseEntityModel {
  @Column({ name: "folder_path", nullable: false })
  location!: string;

  @OneToOne(() => Classes, (classes) => classes.id, { nullable: false })
  @JoinColumn({ name: "class" })
  class!: Classes;
}
