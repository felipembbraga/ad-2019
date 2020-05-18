import { Document, Model, DocumentQuery, Types } from "mongoose";
import { BaseRouter } from "./router";
import { Request, Response, NextFunction } from "express";

/**
 * Classe Router para Models
 */
export abstract class ModelRouter<T extends Document> extends BaseRouter {
    routeName: string; // nome da rota

    pageSize = 500; // número de páginas na listagem

    /**
     * construtor
     * @param model - Model do router
     */
    constructor(protected model: Model<T>) {
        super();
        
        // define o nome da rota como o nome da collection
        this.routeName = `/${model.collection.name}`;
    }

    /**
     * Prepara a query de busca para um registro
     * @param query Query para a busca
     */
    protected prepareOne(query: DocumentQuery<T | null, T>): DocumentQuery<T | null, T> {
        return query;
    }

    /**
     * Valida o id da busca
     */
    // validateId = (req: Request, _res: Response, next: NextFunction) => {
    //     if (!Types.ObjectId.isValid(req.params.id)) {
    //         next(new Error("Document not found"));
    //     } else {
    //         next();
    //     }
    // };
    validateId = (id: any) => {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error("Object not found.");
        }
        return id;
    };


    /**
     * Busca todos os registros do model
     */
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

    /**
     * Busca um documento pelo id
     */
    findById = (req: Request, res: Response, next: NextFunction) => {
        this.prepareOne(this.model.findById(req.params.id)).then(this.render(res, next)).catch(next);
    };

    /**
     * Salva (cria) um documento
     */
    save = (req: Request, res: Response, next: NextFunction) => {
        const document = new this.model(req.body);
        document.save().then(this.render(res, next)).catch(next);
    };

    /**
     * atualiza totalmente um documento
     */
    replace = (req: Request, res: Response, next: NextFunction) => {
        const options = { runValidators: true, overwrite: true };
        this.model
            .update({ _id: req.params.id } as any, req.body, options)
            .exec()
            .then((result: any) => {
                if (result.n) {
                    return this.prepareOne(this.model.findById(req.params.id));
                } else {
                    throw new Error("Documento não encontrado");
                }
            })
            .then(this.render(res, next))
            .catch(next);
    };

    /**
     * Atualiza parcialmente um documento
     */
    update = (req: Request, res: Response, next: NextFunction) => {
        const options = { runValidators: true, new: true };
        this.model
            .findByIdAndUpdate(req.params.id, { $set: req.body }, options)
            .then(this.render(res, next))
            .catch(next);
    };

    /**
     * Deleta um documento
     */
    delete = (req: Request, res: Response, next: NextFunction) => {
        this.model
            .remove({ _id: req.params.id } as any)
            .exec()
            .then((cmdResult: any) => {
                console.log(cmdResult);
                if (cmdResult.n) {
                    res.send(204);
                } else {
                    throw new Error("Documento não encontrado");
                }
                return next();
            })
            .catch(next);
    };
}
