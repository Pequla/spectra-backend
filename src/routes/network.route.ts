
import { Router } from "express"
import { retrieveIdFromPath, sendError } from "../utils"
import { NetworkService } from "../services/network.service"
import { AddressService } from "../services/address.service"

export const NetworkRoute = Router()

NetworkRoute.get('/', async (req: any, res) => {
    try {
        const search = req.query.search as string
        res.json(await NetworkService.getNetworks(search, req.user.id))
    } catch (e) {
        sendError(res, e)
    }
})

NetworkRoute.get('/:id/address', async (req: any, res) => {
    try {
        const id = retrieveIdFromPath(req)
        const search = req.query.search as string

        await NetworkService.getNetworkById(id, req.user.id)

        res.json(await AddressService.getAddressesByNetworkId(id, search))
    } catch (e) {
        sendError(res, e)
    }
})

NetworkRoute.get('/:id', async (req: any, res) => {
    try {
        const id = retrieveIdFromPath(req)
        res.json(await NetworkService.getNetworkById(id, req.user.id))
    } catch (e) {
        sendError(res, e)
    }
})

NetworkRoute.post('/', async (req: any, res) => {
    try {
        await NetworkService.createNetwork(req.body, req.user.id)
        res.status(204).send()
    } catch (e) {
        sendError(res, e)
    }
})

NetworkRoute.put('/:id', async (req: any, res) => {
    try {
        const id = retrieveIdFromPath(req)
        await NetworkService.updateNetwork(id, req.body, req.user.id)
        res.status(204).send()
    } catch (e) {
        sendError(res, e)
    }
})

NetworkRoute.delete('/:id', async (req: any, res) => {
    try {
        const id = retrieveIdFromPath(req)
        await NetworkService.deleteNetwork(id, req.user.id)
        res.status(204).send()
    } catch (e) {
        sendError(res, e)
    }
})