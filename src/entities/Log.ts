import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("log", { schema: "spectra_network_app" })
export class Log {
  @PrimaryGeneratedColumn({ type: "int", name: "log_id", unsigned: true })
  logId: number;

  @Column("text", { name: "value" })
  value: string;

  @Column("enum", {
    name: "level",
    enum: ["info", "warn", "error"],
    default: () => "'info'",
  })
  level: "info" | "warn" | "error";

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}
