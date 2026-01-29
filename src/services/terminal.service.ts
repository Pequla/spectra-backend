import type { Request } from "express";
import { AppDataSource } from "../db";
import { Command } from "../entities/Command";
import { Reply } from "../entities/Reply";
import { NodeService } from "./node.service";
import { In, IsNull } from "typeorm";
import { retrieveIdFromPath } from "../utils";

const commandRepo = AppDataSource.getRepository(Command)
const replyRepo = AppDataSource.getRepository(Reply)

export class TerminalService {
    static async getLastCommandsByNodeId(id: number) {
        const data = await commandRepo.find({
            where: {
                nodeId: id
            },
            order: {
                createdAt: 'desc'
            },
            take: 3,
            relations: {
                replies: true
            }
        })

        const rsp: any[] = []
        data.forEach(c => {
            rsp.push({
                type: 'cmd',
                value: c.value,
                createdAt: c.createdAt
            })

            c.replies.forEach(r => {
                rsp.push({
                    type: 'rep',
                    value: r.value,
                    createdAt: r.createdAt
                })
            })
        })

        return rsp.sort(
            (a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
    }

    static async createCommand(node: number, user: any, data: any) {
        await commandRepo.save({
            nodeId: node,
            userId: user,
            value: data.value
        })
    }

    static async getCommandsByNodeToken(req: Request) {
        const node = await NodeService.retrieveNodeByTokenAndRegisterActivity(req)
        const commands = await commandRepo.find({
            select: {
                commandId: true,
                value: true
            },
            where: {
                nodeId: node.nodeId,
                receivedAt: IsNull()
            }
        })
        
        if (!commands.length) {
            return []
        }

        await commandRepo.update(
            { commandId: In(commands.map(c => c.commandId)) },
            { receivedAt: new Date() }
        )

        return commands
    }

    static async updateCommandReplyByNodeTokenAndCommandId(req: Request) {
        const node = await NodeService.retrieveNodeByTokenAndRegisterActivity(req)
        const id = Number(req.body.commandId)

        const command = await commandRepo.existsBy({
            commandId: id,
            nodeId: node.nodeId
        })

        if (!command)
            throw new Error('COMMAND_NOT_FOUND')

        const replies: string[] = req.body.replies
        for (let r of replies) {
            await replyRepo.save({
                commandId: id,
                value: r,
                createdAt: new Date()
            })
        }
    }

}