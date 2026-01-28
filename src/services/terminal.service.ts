import { AppDataSource } from "../db";
import { Command } from "../entities/Command";
import { Reply } from "../entities/Reply";

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

            console.log(c.replies)
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

}