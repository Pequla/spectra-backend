import { Router } from "express";
import { sendErrorResponse } from "../utils";
import { UserService } from "../services/user.service";

export const UserRoute = Router()

UserRoute.post('/login', async (req, res) => {
    try {
        res.json(await UserService.login(req.body))
    } catch (e) {
        sendErrorResponse(res, 401, "LOGIN_FAILED")
    }
})

UserRoute.post('/refresh', async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        res.json(await UserService.refreshToken(token!))
    } catch (e) {
        sendErrorResponse(res, 401, "REFRESH_FAILED")
    }
})