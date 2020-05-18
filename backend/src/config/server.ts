import db, { DbMongo } from "./database";
import express, { NextFunction, Request, Response } from "express";

import bodyParser from "body-parser";
import cors from "cors";
import environment from "./environment";
import { exec } from "child_process";
import http from "http";
// imports from project
import packageJson from "../../package.json";
import { BaseRouter } from "helpers/router";

/**
 * Classe do Server da aplicação
 */
export default class Server {
    protected _application: express.Express; // Instância da aplicação do express
    protected _server!: http.Server; // Instância do servidor Http
    protected _serverConfig: { port: number }; // Configurações do servidor
    protected _postInitializeDbFunctions: Function[] = [];
    protected _db: DbMongo = db; // Instância do banco de dados

    /**
     * Construtor
     * @param env Configurações de ambiente do servidor
     */
    constructor(env = environment) {
        this._application = express();
        this._serverConfig = env.server;
    }

    /**
     * Retorna a porta em que o servidor está rodando
     */
    public get port(): number {
        return this._serverConfig.port;
    }

    /**
     * Inicializa as rotas junto com as configurações do express
     *
     * @param routers:IBaseRouter[] - Lista de rotas a serem inseridas no servidor
     * @returns Promise<any>
     */
    initRoutes(routers: BaseRouter[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                //proxy
                this._application.set("trust proxy", true);

                //configura o express para tratar os dados vindos pelos requests
                this._application.use(cors());
                this._application.use(bodyParser.urlencoded({ extended: true }));
                this._application.use(bodyParser.json());

                // rota root
                this._application.get("/", (_req, res) => {
                    res.type("text/plain");
                    res.send(`${packageJson.name} - ${packageJson.version}`);
                });

                //rota robots.txt
                this._application.get("/robots.txt", (_req, res) => {
                    res.type("text/plain");
                    res.send("User-agent: *\nDisallow: /");
                });

                //rota build info
                this._application.get("/build-info", async (_req, res) => {
                    const commands = ["node -v", "npm -v"];
                    const [nodeVersion, npmVersion] = await Promise.all(
                        commands.map(
                            (c) =>
                                new Promise((resolve) => {
                                    exec(c, (_error, stdout) => {
                                        resolve(stdout.replace(/(?:\\[rn]|[\r\n]+)+/g, ""));
                                    });
                                })
                        )
                    );
                    res.send({
                        node: nodeVersion,
                        npm: npmVersion,
                        package: packageJson.version,
                        instance: process.env.PM2_INSTANCE_ID,
                        pid: process.pid,
                    });
                });

                // routes
                for (const router of routers) {
                    router.applyRoutes(this._application);
                }

                this._application.use(this.handleErrors);

                // Inicia a aplicação
                this._server = this._application.listen(this._serverConfig.port, () => {
                    resolve(this._application);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Middleware que manipula os erros nos endpoints
     */
    handleErrors = (err: Error, _req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
            return next(err);
        }
        const statusCode = 400;
        const messageCode = 0;
        res.status(statusCode).send({
            message: err.message,
            messageCode,
        });
    };

    /**
     * Inicializa o servidor
     * @param routers:IBaseRouter[] - Rotas do servidor
     */
    async bootstrap(routers: BaseRouter[] = []): Promise<Server> {
        await this._db.initialize();
        await this.initRoutes(routers);
        return this;
    }

    /**
     * Finaliza o servidor
     */
    async shutdown() {
        await this._db.disconnect();
        this._server.close();
    }
}
