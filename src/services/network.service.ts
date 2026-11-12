import { AppDataSource } from "../db";
import { Address } from "../entities/Address";
import { Network } from "../entities/Network";
import IPCIDR from "ip-cidr";
import { randomUUIDv7 } from "bun";
import { filter } from "../utils";
import { UserNetwork } from "../entities/UserNetwork";
import { In, IsNull } from "typeorm"
import { UserService } from "./user.service";

const networkRepo = AppDataSource.getRepository(Network)
const addressRepo = AppDataSource.getRepository(Address)
const userNetworkRepo = AppDataSource.getRepository(UserNetwork)

export class NetworkService {
    static async getNetworks(search: string, userId: number) {
        const user = await UserService.getCurrentUser(userId)

        let allowedNetworkIds: number[] = []

        if (!user.isAdmin) {
            const userNetworks = await userNetworkRepo.find({
                select: {
                    networkId: true
                },
                where: {
                    userId: user.userId,
                    deletedAt: IsNull()
                }
            })

            allowedNetworkIds = userNetworks.map(x => x.networkId)

            if (allowedNetworkIds.length === 0)
                return []
        }

        const where = [
            {
                name: filter(search),
                deletedAt: IsNull(),
                location: {
                    deletedAt: IsNull()
                }
            },
            {
                range: filter(search),
                deletedAt: IsNull(),
                location: {
                    deletedAt: IsNull()
                }
            },
            {
                deletedAt: IsNull(),
                location: {
                    name: filter(search),
                    deletedAt: IsNull()
                }
            }
        ]

        if (!user.isAdmin) {
            for (const condition of where) {
                Object.assign(condition, {
                    networkId: In(allowedNetworkIds)
                })
            }
        }

        return await networkRepo.find({
            select: {
                networkId: true,
                name: true,
                range: true,
                location: {
                    locationId: true,
                    name: true
                },
                createdAt: true,
                updatedAt: true
            },
            where: where,
            relations: {
                location: true
            }
        })
    }

    static async getNetworkById(id: number, userId: number) {
        const user = await UserService.getCurrentUser(userId)

        if (!user.isAdmin) {
            const allowed = await userNetworkRepo.exists({
                where: {
                    userId: user.userId,
                    networkId: id,
                    deletedAt: IsNull()
                }
            })

            if (!allowed)
                throw new Error('NOT_FOUND')
        }

        const data = await networkRepo.findOne({
            where: {
                networkId: id,
                deletedAt: IsNull(),
                location: {
                    deletedAt: IsNull()
                }
            }
        })

        if (data == null)
            throw new Error('NOT_FOUND')

        return data
    }

    static async createNetwork(model: Network, userId: number) {
        await UserService.requireAdmin(userId)

        if (!IPCIDR.isValidCIDR(model.range))
            throw new Error("INVALID_CIDR_FORMAT")

        const newNetwork = await networkRepo.save({
            name: model.name,
            locationId: model.locationId,
            range: model.range
        })

        await this.generateNetworkAddresses(newNetwork.networkId, newNetwork.range)
    }

    static async generateNetworkAddresses(id: number, cidr: string) {
        const arr = []
        const ipRange = new IPCIDR(cidr)

        const networkAddress = ipRange.start();
        const broadcastAddress = ipRange.end();

        for (let ip of ipRange.toArray() ?? []) {
            if (ip !== networkAddress && ip !== broadcastAddress) {
                arr.push({
                    networkId: id,
                    value: ip,
                    online: false,
                    verified: false,
                    notifications: false,
                    tracking: false,
                    token: randomUUIDv7(),
                    createdAt: new Date()
                })
            }
        }
        await addressRepo.save(arr)
    }

    static async updateNetwork(id: number, model: Network, userId: number) {
        await UserService.requireAdmin(userId)

        const data = await this.getNetworkById(id, userId)
        data.name = model.name
        data.range = model.range
        data.updatedAt = new Date()
        await networkRepo.save(data)
    }

    static async deleteNetwork(id: number, userId: number) {
        await UserService.requireAdmin(userId)

        const data = await this.getNetworkById(id, userId)
        data.deletedAt = new Date()
        await networkRepo.save(data)
    }
}