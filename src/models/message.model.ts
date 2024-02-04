import { Entity, Column, OneToMany, Check, ManyToOne } from "typeorm";
import { BaseEntityModel } from "./base.model";
import { Group } from ".";
@Entity("message")
@Check(`"is_deleted" = false`)
export class Message extends BaseEntityModel {
  @Column({ nullable: false })
  sender!: string;

  @Column({ nullable: false })
  receiver!: string;

  @Column({ nullable: false })
  message!: string;

  @ManyToOne(() => Group, (group) => group.id)
  group!: Group;
}
