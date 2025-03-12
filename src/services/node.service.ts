import { In, IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Node } from "../entities/Node";
import type { Request } from "express";
import { Address } from "../entities/Address";
import type { NodeModel } from "../models/node.model";
import { NetworkService } from "./network.service";

const nodeRepo = AppDataSource.getRepository(Node)
const addressRepo = AppDataSource.getRepository(Address)

export class NodeService {
    static async getNodes() {
        return await nodeRepo.find({
            select: {
                nodeId: true,
                name: true,
                address: true,
                lastReportAt: true,
                network: {
                    networkId: true,
                    range: true
                }
            },
            where: {
                deletedAt: IsNull(),
                network: {
                    deletedAt: IsNull()
                }
            }
        })
    }

    static async getNodeDataByToken(req: Request) {
        const node = await nodeRepo.findOne({
            where: {
                token: this.getTokenFromRequest(req),
                deletedAt: IsNull(),
                network: {
                    deletedAt: IsNull()
                }
            }
        })

        if (node == null)
            throw new Error('INVALID_NODE')

        node.lastReportAt = new Date()
        node.address = req.ip || 'localhost'
        await nodeRepo.save(node)

        // Generate addresses if network is empty
        const count = await addressRepo.countBy({
            networkId: node.networkId
        })

        if (count == 0) {
            const network = await NetworkService.getNetworkById(node.networkId)
            await NetworkService.generateNetworkAddresses(node.networkId, network.range)
        }

        return await addressRepo.find({
            select: {
                addressId: true,
                value: true,
                mac: true,
                token: true,
                wol: true
            },
            where: {
                networkId: node.networkId,
                deletedAt: IsNull(),
                network: {
                    deletedAt: IsNull()
                },
                tracking: true
            }
        })
    }

    static async saveNodeDataByToken(req: Request) {
        const node = await nodeRepo.findOne({
            where: {
                token: this.getTokenFromRequest(req),
                deletedAt: IsNull(),
                network: {
                    deletedAt: IsNull()
                }
            }
        })

        if (node == null)
            throw new Error('INVALID_NODE')

        const model: NodeModel = req.body
        const addresses = await addressRepo.find({
            where: {
                addressId: In(model.report.map(a => a.addressId)),
                deletedAt: IsNull(),
                network: {
                    deletedAt: IsNull()
                }
            }
        })

        for (let modelResponse of model.report) {
            for (let address of addresses) {
                if (modelResponse.addressId == address.addressId) {
                    address.online = modelResponse.alive
                    address.mac = modelResponse.mac
                    address.lastReportAt = new Date(modelResponse.timestamp)
                }
            }
        }

        await addressRepo.save(addresses)

        node.lastReportAt = new Date()
        node.address = req.ip || 'localhost'
        await nodeRepo.save(node)
    }

    static getTokenFromRequest(req: Request) {
        const token = req.headers['x-token']
        return Array.isArray(token) ? token[0] : token || ''
    }
}