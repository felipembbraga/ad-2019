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

    findAll = (req: Request, res: Response, next: NextFunction) => {
        const { page, ...queryDocument } = req.query;
        let currentPage = page ? parseInt(page.toString()) : 1;
        currentPage = currentPage > 0 ? currentPage : 1;

        const skip = (currentPage - 1) * this.pageSize;

        this.model
            .countDocuments(queryDocument as any)
            .exec()
            .then((count: number) =>
                this.model
                    .find(queryDocument as any)
                    .populate("friend")
                    .skip(skip)
                    .limit(this.pageSize)
                    .then(
                        this.renderAll(res, next, {
                            page,
                            count,
                            pageSize: this.pageSize,
                            url: req.url,
                        })
                    )
            )
            .catch(next);
    };

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
