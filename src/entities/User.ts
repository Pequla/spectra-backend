import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user", { schema: "spectra_network_app" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", { name: "username", length: 255 })
  username: string;

  @Column("varchar", { name: "display_name", length: 255 })
  displayName: string;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("varchar", { name: "phone", length: 255 })
  phone: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("boolean", { name: "active", default: () => "'true'" })
  active: boolean;

  @Column("boolean", { name: "notifications", default: () => "'true'" })
  notifications: boolean;

  @Column("datetime", { name: "last_login_at", nullable: true })
  lastLoginAt: Date | null;
}
