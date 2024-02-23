import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Classes } from "./class.model";
import { BaseEntityModel } from "./base.model";
import { Day } from "../enums/day.enums";

@Entity("timetable")
export class Timetable extends BaseEntityModel {
  @ManyToOne(() => Classes, { nullable: false })
  @JoinColumn({ name: "class_id" })
  class!: Classes;

  @Column({ type: "enum", enum: Day })
  day!: Day;

  @Column({ type: "json", nullable: false })
  schedule!: Record<string, string>;
}
