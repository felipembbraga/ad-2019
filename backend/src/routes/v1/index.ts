// import devices from './devices'
import { Router } from "express";
import { BaseRouter } from "../../helpers/router";
import { userRouter } from "./UserRouter";

class RouterV1 extends BaseRouter {
    routeName = "/v1";
    router: Router = Router();

    constructor() {
        super();
        this.router.get("/", (_req, res) => res.send({ routeName: this.routeName }));
        this.addSubRouter(userRouter);
    }
}

export const routerV1 = new RouterV1();
