import { Entity, Column, Check, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntityModel } from "./base.model";
import { Student } from "./student.model";
@Entity("feedetails")
@Check(`"is_deleted" = false`)
export class FeeDetails extends BaseEntityModel {
  @Column({ name: "amount" })
  amount!: number;

  @Column({ name: "transaction_id" })
  transaction_id!: string;

  @Column({
    name: "payment_date",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  payment_date!: Date;

  @Column({ name: "is_paid" })
  is_paid!: boolean;

  @ManyToOne(() => Student, (student) => student.ht_no)
  @JoinColumn({ name: "ht_no" })
  student!: Student;
}
