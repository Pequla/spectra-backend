import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Address } from "../entities/Address";
import { filter } from "../utils";

const repo = AppDataSource.getRepository(Address)

export class AddressService {
    static async getAddressesByNetworkId(id: number, search: string) {
        return await repo.find({
            select: {
                addressId: true,
                value: true,
                label: true,
                device: true,
                mac: true,
                tracking: true,
                lastReportAt: true,
                online: true,
                wol: true,
                notifications: true
            },
            where: [
                {
                    networkId: id,
                    value: filter(search),
                    deletedAt: IsNull(),
                    network: {
                        deletedAt: IsNull()
                    }
                },
                {
                    networkId: id,
                    label: filter(search),
                    deletedAt: IsNull(),
                    network: {
                        deletedAt: IsNull()
                    }
                },
                {
                    networkId: id,
                    device: filter(search),
                    deletedAt: IsNull(),
                    network: {
                        deletedAt: IsNull()
                    }
                },
                {
                    networkId: id,
                    mac: filter(search),
                    deletedAt: IsNull(),
                    network: {
                        deletedAt: IsNull()
                    }
                }
            ]
        })
    }

    static async getAddressById(id: number) {
        const data = await repo.findOne({
            where: {
                addressId: id,
                deletedAt: IsNull(),
                network: {
                    deletedAt: IsNull()
                }
            }
        })

        if (data == null)
            throw new Error('NOT_FOUND')

        return data
    }

    static async updateAddress(id: number, model: Address) {
        const data = await this.getAddressById(id)
        data.networkId = model.networkId
        data.value = model.value
        data.label = model.label
        data.device = model.device
        data.mac = model.mac
        data.note = model.note
        data.tracking = model.tracking
        data.wol = model.wol
        data.notifications = model.notifications
        data.updatedAt = new Date()
        await repo.save(data)
    }
}