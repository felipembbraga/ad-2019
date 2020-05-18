import { QueryPopulateOptions } from "mongoose";

export interface IFindOptions {
    params: { [key: string]: any };
    fields?: [];
    sort?: {[key: string]: number};
    page?: number;
    pageSize?: number;
    populate?: QueryPopulateOptions;
}
