import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Command } from "./Command";

@Index("fk_reply_command_idx", ["commandId"], {})
@Entity("reply", { schema: "spectra_network_app" })
export class Reply {
  @PrimaryGeneratedColumn({ type: "int", name: "reply_id", unsigned: true })
  replyId: number;

  @Column("text", { name: "value" })
  value: string;

  @Column("int", { name: "command_id", unsigned: true })
  commandId: number;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(() => Command, (command) => command.replies, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "command_id", referencedColumnName: "commandId" }])
  command: Command;
}
