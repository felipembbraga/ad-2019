// pacotes npm
import mongoose, { Connection, ConnectionOptions } from "mongoose";

import environment from "./environment";
import pino from "pino";

const logger = pino();


export class DbMongo {
    private mongoOptions: ConnectionOptions;
    private _connection!: Connection;

    public constructor() {
        this.mongoOptions = {
            poolSize: 10,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        };

        mongoose.set("useCreateIndex", true);
    }

    public initialize() {
        return new Promise((resolve, reject) => {
            mongoose
                .connect(environment.mongodb.url, this.mongoOptions)
                .then(conn => {
                    this._connection = conn.connection;
                    this._connection.on("error", err => {
                        logger.error(err);
                    });
                    console.log("[DB] connected to " + environment.mongodb.url);

                    this._connection.on("closed", () => {
                        logger.info("Disconnected");
                    });
                    resolve(this);
                })
                .catch(err => {
                    logger.error(err);
                    reject(err);
                });
        });
    }

    public disconnect() {
        return this._connection.close();
    }
}

const db = new DbMongo();
export default db;
