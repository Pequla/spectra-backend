import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Network } from "./Network";

@Entity("location", { schema: "spectra_network_app" })
export class Location {
  @PrimaryGeneratedColumn({ type: "int", name: "location_id", unsigned: true })
  locationId: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Network, (network) => network.location)
  networks: Network[];
}
