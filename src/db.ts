import dotenv from "dotenv"
import { DataSource } from "typeorm";
import { Address } from "./entities/Address";
import { Log } from "./entities/Log";
import { Network } from "./entities/Network";
import { User } from "./entities/User";
import { Location } from "./entities/Location";
import { Node } from "./entities/Node";

// Connecting to database
dotenv.config();
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DATABASE_HOST,
    port: Number.parseInt(process.env.DATABASE_PORT!),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
        Address, Location, Log, Network, Node, User
    ],
    logging: false,
})