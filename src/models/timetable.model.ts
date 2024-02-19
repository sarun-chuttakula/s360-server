import {
  Entity,
  Column,
  OneToMany,
  Check,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Classes } from "./class.model";
import { BaseEntityModel } from "./base.model";
import { Day } from "../enums/day.enums";
@Entity("timetable")
@Check(`"is_deleted" = false`)
export class Timetable extends BaseEntityModel {
  @Column({ nullable: false, type: "enum", enum: Day })
  day!: Day;

  @Column({ nullable: true })
  start_time!: string;

  @Column({ nullable: false, type: "datetime" })
  end_time!: Date;

  @Column({ nullable: false })
  period!: number;

  @Column({ nullable: false })
  subject!: string;

  @ManyToOne(() => Classes, (classes) => classes.id, { nullable: false })
  @JoinColumn({ name: "class" })
  class!: Classes;
}
