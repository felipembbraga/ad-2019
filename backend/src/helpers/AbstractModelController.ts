import { Document, FilterQuery, Model, QueryFindOneAndUpdateOptions, Types } from "mongoose";

import { IFindOptions } from "./interfaces/services";

/**
 * Classe abstrata para os controllers.
 */
export default abstract class AbstractModelController<T extends Document> {
    constructor(protected model: Model<T>) {}

    protected validateId = (id: any) => {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error("Object not found.");
        }
        return id;
    };

    protected async create(data: any) {
        const instance = new this.model(data);
        await instance.validate();
        await instance.save();

        return instance;
    }

    protected async find(options: IFindOptions) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const pageSize = options.pageSize && options.pageSize > 0 && options.pageSize < 10 ? options.pageSize : 100;
        const skip = (page - 1) * pageSize;

        const total = await this.model.countDocuments(options.params as FilterQuery<T>);
        const fields: string[] = options.fields || [];
        let query = this.model
            .find(options.params as FilterQuery<T>)
            .skip(skip)
            .limit(pageSize)
            .select(fields.join(" "));

        if (options.populate) {
            query = query.populate(options.populate);
        }

        if (options.sort) {
            query = query.sort(options.sort);
        }
        const documents = await query.exec();

        return { total, page, pageSize, documents };
    }

    protected async findById(id: any) {
        return await this.model.findById(this.validateId(id)).exec();
    }

    protected async update(id: any, data: any) {
        const options: QueryFindOneAndUpdateOptions = {
            runValidators: true,
            new: true,
        };
        const updatedDocument = await this.model.findByIdAndUpdate(id, data, options);

        return updatedDocument;
    }

    protected async delete(id: any) {

        const deletedDocument = await this.model.findByIdAndRemove(id);

        return deletedDocument;
    }
}
