import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Node } from "./Node";
import { User } from "./User";
import { Reply } from "./Reply";

@Index("fk_command_node_idx", ["nodeId"], {})
@Index("fk_command_user_idx", ["userId"], {})
@Entity("command", { schema: "spectra_network_app" })
export class Command {
  @PrimaryGeneratedColumn({ type: "int", name: "command_id", unsigned: true })
  commandId: number;

  @Column("text", { name: "value" })
  value: string;

  @Column("int", { name: "node_id", unsigned: true })
  nodeId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(() => Node, (node) => node.commands, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "node_id", referencedColumnName: "nodeId" }])
  node: Node;

  @ManyToOne(() => User, (user) => user.commands, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;

  @OneToMany(() => Reply, (reply) => reply.command)
  replies: Reply[];
}
