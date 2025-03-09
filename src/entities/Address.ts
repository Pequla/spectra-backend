import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Network } from "./Network";

@Index("fk_address_network_idx", ["networkId"], {})
@Entity("address", { schema: "spectra_network_app" })
export class Address {
  @PrimaryGeneratedColumn({ type: "int", name: "address_id", unsigned: true })
  addressId: number;

  @Column("int", { name: "network_id", unsigned: true })
  networkId: number;

  @Column("varchar", { name: "value", length: 255 })
  value: string;

  @Column("varchar", { name: "label", nullable: true, length: 255 })
  label: string | null;

  @Column("varchar", { name: "device", nullable: true, length: 255 })
  device: string | null;

  @Column("varchar", { name: "mac", nullable: true, length: 255 })
  mac: string | null;

  @Column("text", { name: "note", nullable: true })
  note: string | null;

  @Column("boolean", { name: "online", default: () => "'false'" })
  online: boolean;

  @Column("boolean", { name: "verified", default: () => "'false'" })
  verified: boolean;

  @Column("varchar", { name: "token", length: 255 })
  token: string;

  @Column("boolean", { name: "notifications", default: () => "'false'" })
  notifications: boolean;

  @Column("boolean", { name: "tracking", default: () => "'false'" })
  tracking: boolean;

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

  @ManyToOne(() => Network, (network) => network.addresses, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "network_id", referencedColumnName: "networkId" }])
  network: Network;
}
