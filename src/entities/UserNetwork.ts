import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_network", { schema: "spectra_network_app" })
export class UserNetwork {
    @PrimaryGeneratedColumn({ type: "int", name: "user_network_id", unsigned: true })
    userNetworkId: number;

    @Column("int", { name: "user_id", unsigned: true })
    userId: number;

    @Column("int", { name: "network_id", unsigned: true })
    networkId: number;

    @Column("datetime", { name: "created_at", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column("datetime", { name: "deleted_at", nullable: true, default: null })
    deletedAt: Date | null;
}