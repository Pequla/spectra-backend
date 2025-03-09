import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Network } from "./Network";

@Index("fk_node_network_idx", ["networkId"], {})
@Entity("node", { schema: "spectra_network_app" })
export class Node {
  @PrimaryGeneratedColumn({ type: "int", name: "node_id", unsigned: true })
  nodeId: number;

  @Column("int", { name: "network_id", unsigned: true })
  networkId: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "token", length: 255 })
  token: string;

  @Column("varchar", { name: "address", length: 255 })
  address: string;

  @Column("datetime", { name: "last_report_at", nullable: true })
  lastReportAt: Date | null;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Network, (network) => network.nodes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "network_id", referencedColumnName: "networkId" }])
  network: Network;
}
