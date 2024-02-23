import {
  Entity,
  Column,
  OneToMany,
  Check,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntityModel } from "./base.model";
import { BatchFolder } from "./batch-folder.model";
@Entity("classes")
@Check(`"is_deleted" = false`)
export class Classes extends BaseEntityModel {
  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: true })
  year!: number;

  @ManyToOne(() => BatchFolder, (batchfolder) => batchfolder.id, {
    nullable: false,
  })
  @JoinColumn({ name: "batch" })
  batchfolder!: BatchFolder;
}
