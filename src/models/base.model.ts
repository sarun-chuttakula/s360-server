import { randomUUID } from "crypto";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export class BaseEntityModel extends BaseEntity {
  @Index({ unique: true })
  @PrimaryColumn({ nullable: false })
  id: string = randomUUID();

  @CreateDateColumn()
  created_at: Date = new Date();

  @UpdateDateColumn()
  updated_at: Date = new Date();

  @Column({ name: "created_by" })
  created_by!: string;

  @Column({ name: "updated_by" })
  updated_by!: string;

  @Column({ default: true, name: "is_active" })
  is_active!: boolean;

  @Column({ default: false, name: "is_deleted", select: false })
  is_deleted!: boolean;
}
