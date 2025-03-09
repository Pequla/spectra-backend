import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Address } from "./Address";
import { Location } from "./Location";
import { Node } from "./Node";

@Index("fk_network_location_idx", ["locationId"], {})
@Entity("network", { schema: "spectra_network_app" })
export class Network {
  @PrimaryGeneratedColumn({ type: "int", name: "network_id", unsigned: true })
  networkId: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "range", length: 255 })
  range: string;

  @Column("int", { name: "location_id", unsigned: true })
  locationId: number;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Address, (address) => address.network)
  addresses: Address[];

  @ManyToOne(() => Location, (location) => location.networks, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "location_id", referencedColumnName: "locationId" }])
  location: Location;

  @OneToMany(() => Node, (node) => node.network)
  nodes: Node[];
}
