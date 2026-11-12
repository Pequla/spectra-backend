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
            await repo.update(user.userId, { lastLoginAt: new Date() })
            return {
                access: jwt.sign({ id: user.userId, display: user.displayName, isAdmin: user.isAdmin }, accessSecret, { expiresIn: accessExpire }),
                refresh: jwt.sign({ id: user.userId, display: user.displayName, isAdmin: user.isAdmin }, refreshSecret, { expiresIn: refreshExpire }),
                name: user.displayName,
                isAdmin: user.isAdmin
            };
        }
        throw new Error('BAD_CREDENTIALS')
    }

    static async refreshToken(refresh: string) {
        try {
            const decoded: any = jwt.verify(refresh, refreshSecret as string)

            const user = await repo.findOne({
                where: {
                    userId: decoded.id,
                    active: true
                }
            })

            if (user == null)
                throw new Error('UNAUTHORIZED')

            return {
                access: jwt.sign({
                    id: user.userId,
                    display: user.displayName,
                    isAdmin: user.isAdmin
                }, accessSecret, { expiresIn: accessExpire }),
                refresh: refresh,
                name: user.displayName,
                isAdmin: user.isAdmin
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

    public static async getCurrentUser(userId: number) {
        const user = await repo.findOne({
            where: {
                userId: userId,
                active: true
            }
        })

        if (user == null)
            throw new Error('UNAUTHORIZED')

        return user
    }

    public static async requireAdmin(userId: number) {
        const user = await this.getCurrentUser(userId)

        if (!user.isAdmin)
            throw new Error('FORBIDDEN')
    }
}