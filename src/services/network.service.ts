import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Address } from "../entities/Address";
import { Network } from "../entities/Network";
import IPCIDR from "ip-cidr";
import { randomUUIDv7 } from "bun";

const networkRepo = AppDataSource.getRepository(Network)
const addressRepo = AppDataSource.getRepository(Address)

export class NetworkService {
    static async getNetworks() {
        return await networkRepo.find({
            select: {
                networkId: true,
                name: true,
                range: true,
                location: {
                    locationId: true,
                    name: true
                }
            },
            where: {
                deletedAt: IsNull(),
                location: {
                    deletedAt: IsNull()
                }
            },
            relations: {
                location: true
            }
        })
    }

    static async getNetworkById(id: number) {
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

    static async createNetwork(model: Network) {
        if (!IPCIDR.isValidCIDR(model.range)) {
            throw new Error("INVALID_CIDR_FORMAT")
        }

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

    static async updateNetwork(id: number, model: Network) {
        const data = await this.getNetworkById(id)
        data.name = model.name
        data.range = model.range
        data.updatedAt = new Date()
        await networkRepo.save(data)
    }

    static async deleteNetwork(id: number) {
        const data = await this.getNetworkById(id)
        data.deletedAt = new Date()
        await networkRepo.save(data)
    }
}