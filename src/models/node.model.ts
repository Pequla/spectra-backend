export interface NodeModel {
    timestamp: string,
    report: {
        addressId: number
        alive: boolean
        mac: string
        timestamp: string
    }[]
}