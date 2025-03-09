import { Router } from "express";
import { NodeService } from "../services/node.service";
import { sendError } from "../utils";

export const NodeRoute = Router()

NodeRoute.get('/heartbeat', async (req, res) => {
    try { 
        res.json(await NodeService.getNodeDataByToken(req))
    } catch (e) {
        sendError(res, e)
    }
})

NodeRoute.post('/heartbeat', async (req, res) => {
    try { 
        res.json(await NodeService.saveNodeDataByToken(req))
    } catch (e) {
        sendError(res, e)
    }
})