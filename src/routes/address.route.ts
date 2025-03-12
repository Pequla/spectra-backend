import { Router } from "express";
import { retrieveIdFromPath, sendError } from "../utils";
import { AddressService } from "../services/address.service";

export const AddressRoute = Router()

AddressRoute.get('/:id', async (req, res) => {
    try {
        const id = retrieveIdFromPath(req)
        res.json(await AddressService.getAddressById(id))
    } catch (e) {
        sendError(res, e)
    }
})

AddressRoute.put('/:id', async (req, res) => {
    try {
        const id = retrieveIdFromPath(req)
        await AddressService.updateAddress(id, req.body)
        res.status(204).send()
    } catch (e) {
        sendError(res, e)
    }
})