import { Router } from "express";
import { NodeService } from "../services/node.service";
import { retrieveIdFromPath, sendError } from "../utils";
import { TerminalService } from "../services/terminal.service";

export const NodeRoute = Router()

NodeRoute.get('/', async (req, res) => {
    try {
        const search = req.query.search as string
        res.json(await NodeService.getNodes(search))
    } catch (e) {
        sendError(res, e)
    }
})

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

NodeRoute.get('/retrieve-commands', async (req, res) => {
    try {
        res.json(await TerminalService.getCommandsByNodeToken(req))
    } catch (e) {
        sendError(res, e)
    }
})

NodeRoute.post('/command-reply', async (req, res) => {
    try {
        await TerminalService.updateCommandReplyByNodeTokenAndCommandId(req)
        res.sendStatus(204)
    } catch (e) {
        sendError(res, e)
    }
})

NodeRoute.get('/:id/terminal', async (req, res) => {
    try {
        const id = retrieveIdFromPath(req)
        res.json(await TerminalService.getLastCommandsByNodeId(id))
    } catch (e) {
        sendError(res, e)
    }
})

NodeRoute.post('/:id/terminal', async (req: any, res) => {
    try {
        const id = retrieveIdFromPath(req)
        await TerminalService.createCommand(id, req.user.id, req.body)
        res.sendStatus(204)
    } catch (e) {
        sendError(res, e)
    }
})

NodeRoute.get('/:id', async (req, res) => {
    try {
        const id = retrieveIdFromPath(req)
        res.json(await NodeService.getNodeById(id))
    } catch (e) {
        sendError(res, e)
    }
})