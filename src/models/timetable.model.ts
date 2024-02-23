import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Classes } from "./class.model";
import { BaseEntityModel } from "./base.model";
import { Day } from "../enums/day.enums";
import { User } from "./user.model";

// Define the type for a schedule entry
type ScheduleEntry = {
  subject: string;
  teacher_id: string;
  teacher_name: string;
};

@Entity("timetable")
export class Timetable extends BaseEntityModel {
  @ManyToOne(() => Classes, { nullable: false })
  @JoinColumn({ name: "class_id" })
  class!: Classes;

  @Column({ type: "enum", enum: Day, nullable: false })
  day!: Day;

  // Ensure the JSON column is properly defined
  @Column({ type: "json", nullable: false })
  schedule!: ScheduleEntry[]; // Store as array of ScheduleEntry objects
}
