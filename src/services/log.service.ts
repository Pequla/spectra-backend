import { AppDataSource } from "../db";
import { Log } from "../entities/Log";

const repo = AppDataSource.getRepository(Log)

export class LogService {
    static async saveLog(value: string, level: "info" | "warn" | "error") {
        await repo.save({
            value: value,
            level: level,
            createdAt: new Date()
        })
    }
}