import {EntityTarget, ObjectLiteral, Repository} from "typeorm";
import dataSource from "./dataSource";

export const dsPromise = dataSource.initialize();

export async function getRepository<T extends ObjectLiteral>(target: EntityTarget<T>): Promise<Repository<T>> {
    const ds = await dsPromise;
    return ds.getRepository(target);
}
