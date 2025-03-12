import { Router } from "express";
import { retrieveIdFromPath, sendError } from "../utils";
import { LocationService } from "../services/location.service";

export const LocationRoute = Router()

LocationRoute.get('/', async (req, res) => {
    try {
        const search = req.query.search as string
        res.json(await LocationService.getLocations(search))
    } catch (e) {
        sendError(res, e)
    }
})

LocationRoute.get('/:id', async (req, res) => {
    try {
        const id = retrieveIdFromPath(req)
        res.json(await LocationService.getLocationById(id))
    } catch (e) {
        sendError(res, e)
    }
})

LocationRoute.post('/', async (req, res) => {
    try {
        await LocationService.createLocation(req.body)
        res.status(204).send()
    } catch (e) {
        sendError(res, e)
    }
})

LocationRoute.put('/:id', async (req, res) => {
    try {
        const id = retrieveIdFromPath(req)
        await LocationService.updateLocation(id, req.body)
        res.status(204).send()
    } catch (e) {
        sendError(res, e)
    }
})

LocationRoute.delete('/:id', async (req, res) => {
    try {
        const id = retrieveIdFromPath(req)
        await LocationService.deleteLocation(id)
        res.status(204).send()
    } catch (e) {
        sendError(res, e)
    }
})