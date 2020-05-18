import { ModelRouter } from "../../helpers/model_router";
import User, { User as UserInterface, UserModel } from "../../models/User";
import { Router, NextFunction, Request, Response } from "express";

class UserRouter extends ModelRouter<UserInterface> {
    router: Router = Router();

    constructor(model: UserModel) {
        super(model);

        this.router.get("/", this.findAll);
        this.router.post("/", this.save);
        this.router.get("/draw", this.draw);
        this.router.get("/:id", this.findById);
        this.router.put("/:id", this.update);
        this.router.delete("/:id", this.delete);
    }

    draw = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await User.draw();
            return res.json({success: true, data: response});
        } catch (error) {
            return next(error);
        }
    };

}

export const userRouter = new UserRouter(User);
