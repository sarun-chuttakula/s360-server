// GroupMember.ts
import { Entity, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntityModel } from "./base.model";
import { Group, User } from ".";

@Entity("group_member")
export class GroupMember extends BaseEntityModel {
  @ManyToOne(() => Group, (group) => group.id)
  @JoinColumn({ name: "group_id" })
  group!: Group;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "admin_id" })
  admin!: User;
}
