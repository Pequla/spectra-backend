import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Location } from "../entities/Location";

const repo = AppDataSource.getRepository(Location)

export class LocationService {
    static async getLocations() {
        return await repo.find({
            where: {
                deletedAt: IsNull()
            }
        })
    }

    static async getLocationById(id: number) {
        const data = await repo.findOne({
            where: {
                locationId: id,
                deletedAt: IsNull()
            }
        })

        if (data == null)
            throw new Error('NOT_FOUND')

        return data
    }

    static async createLocation(model: Location) {
        await repo.save({
            name: model.name,
            createdAt: new Date()
        })
    }

    static async updateLocation(id: number, model: Location) {
        const data = await this.getLocationById(id)
        data.name = model.name
        data.updatedAt = new Date()
        await repo.save(data)
    }

    static async deleteLocation(id: number) {
        const data = await this.getLocationById(id)
        data.deletedAt = new Date()
        await repo.save(data)
    }
}