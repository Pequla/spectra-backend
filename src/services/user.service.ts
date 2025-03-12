import { AppDataSource } from "../db";
import dotenv from "dotenv";
import type { LoginModel } from "../models/login.model";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { User } from "../entities/User";

const repo = AppDataSource.getRepository(User);

dotenv.config();
const accessSecret = process.env.ACCESS_TOKEN_SECRET!;
const accessExpire = process.env.ACCESS_TOKEN_TTL!;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET!;
const refreshExpire = process.env.REFRESH_TOKEN_TTL!;

export class UserService {

    static async login(model: LoginModel) {
        const user = await this.findByUsername(model.username)
        if (await bcrypt.compare(model.password, user.password)) {
            return {
                access: jwt.sign({ name: user.userId, display: user.displayName }, accessSecret, { expiresIn: accessExpire }),
                refresh: jwt.sign({ name: user.userId, display: user.displayName }, refreshSecret, { expiresIn: refreshExpire }),
                name: user.displayName
            };
        }
        throw new Error('BAD_CREDENTIALS')
    }

    static async refreshToken(refresh: string) {
        try {
            const decoded: any = jwt.verify(refresh, refreshSecret as string)
            return {
                access: jwt.sign({ name: decoded.name, display: decoded.display }, accessSecret, { expiresIn: accessExpire }),
                refresh: refresh,
                name: decoded.display
            }
        } catch (err) {
            throw new Error('REFRESH_FAILED')
        }
    }

    static async findByUsername(username: string) {
        const data = await repo.findOne({
            where: [
                { username: username, active: true },
                { email: username, active: true }
            ]
        });
    
        if (!data) throw new Error('BAD_CREDENTIALS');
    
        return data;
    }
}