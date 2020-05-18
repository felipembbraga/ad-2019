import { Express, Router, Response, NextFunction } from "express";
import { EventEmitter } from "events";

export interface BaseRouter {
    applyRoutes(application: Express | Router): void;
    addSubRouter(router: BaseRouter | Router): void;
}

export abstract class BaseRouter extends EventEmitter implements BaseRouter {
    abstract routeName: string;
    abstract router: Router;
    subRouters: BaseRouter[] = [];

    applyRoutes(application: Express | Router): void {
        // Adiciona as subrotas
        for (const router of this.subRouters) {
            router.applyRoutes(this.router);
        }

        // adiciona a rota na aplicação
        (application as Express).use(this.routeName, this.router);
    }

    addSubRouter(router: BaseRouter): void {
        this.subRouters.push(router);
    }

    envelope(document: any): any {
        // let resource = Object.assign({_links:{}}, document.toJSON())
        // resource._links.self = `${this.routeName}/${resource._id}`
        return document;
    }

    envelopeAll(documents: any[], options: any = {}): any {
        const resource: any = {
            items: documents
        };
        if (options.page && options.count && options.pageSize) {
            if (options.page > 1) {
                resource._links.previous = `${
                    this.routeName
                }?_page=${options.page - 1}`;
            }
            const remaining = options.count - options.page * options.pageSize;
            if (remaining > 0) {
                resource._links.next = `${this.routeName}?_page=${options.page +
                    1}`;
            }
        }
        return resource;
    }

    render(res: Response, next: NextFunction) {
        return (document: any) => {
            if (document) {
                this.emit("beforeRender", document);
                return res.send(document);
            }
            return next(new Error("Objeto não encontrado"));
        };
    }

    renderAll(response: Response, next: NextFunction, options: any = {}) {
        return (documents: any[]) => {
            if (documents) {
                documents.forEach((document, index, array) => {
                    this.emit("beforeRender", document);
                    array[index] = this.envelope(document);
                });
                response.json(this.envelopeAll(documents, options));
            } else {
                response.json(this.envelopeAll([]));
            }
            return next(false);
        };
    }
}
