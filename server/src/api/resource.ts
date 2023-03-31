import {Router} from "express";
import {DataSource, EntityManager, EntityTarget, FindOptionsWhere, ObjectLiteral, Repository} from "typeorm";
import {asyncHandler} from "./asyncHandler";
import {Request} from "express-serve-static-core"
import {FindOptionsRelations} from "typeorm/find-options/FindOptionsRelations";
import {BadRequest} from "http-errors";

type CRUDPayloadTrigger<Entity extends ObjectLiteral> = {
    <Payload>(payload: Payload, record: Entity, repo: Repository<Entity>, tx: EntityManager): any;
};

type CRUDTrigger<Entity extends ObjectLiteral> = {
    <Payload>(record: Entity, repo: Repository<Entity>, tx: EntityManager): any;
}

export interface ResourceOptions<Entity extends ObjectLiteral> {
    relations?: FindOptionsRelations<Entity>;
    children?: Record<string, Router>;
    softDelete?: boolean;
    parentIdField?: keyof Entity;
    afterCreate?: CRUDPayloadTrigger<Entity>;
    afterUpdate?: CRUDPayloadTrigger<Entity>;
    beforeDelete?: CRUDTrigger<Entity>;
}

export function Resource<Entity extends ObjectLiteral>(
    managerPromise: Promise<EntityManager | DataSource>,
    target: EntityTarget<Entity>,
    {
        relations,
        children = {},
        softDelete,
        parentIdField,
        afterCreate,
        afterUpdate,
        beforeDelete,
    }: ResourceOptions<Entity> = {}
) {
    const route = Router();

    async function transaction<T>(fn: (repo: Repository<Entity>, tx: EntityManager) => Promise<T>) {
        const manager = await managerPromise;
        await manager.transaction<T>(async (tx) => {
            return await fn(tx.getRepository(target), tx);
        });
    }

    route.get("/", asyncHandler(async (req, res) => {
        await transaction(async (repo) => {
            const result = await repo.find({
                ...paginationFromRequest(req),
                relations,
                where: buildParentCondition(req.params),
            });
            res.json(result);
        })
    }));

    route.get("/:id", asyncHandler(async (req, res) => {
        await transaction(async (repo) => {
            const result = await repo.findOne({
                where: {
                    ...buildParentCondition(req.params),
                    id: req.params["id"] as any
                },
                relations,
            })
            if (result == null) {
                res.status(404).end();
            }
            else {
                res.json(result);
            }
        });
    }));

    route.post("/", asyncHandler(async (req, res) => {
        await transaction(async (repo, tx) => {
            let payload = {...req.body} as any;
            if (parentIdField != null) {
                payload[parentIdField] = req.params["parentId"];
            }
            const result = await repo.save(payload);
            await afterCreate?.(payload, result, repo, tx);
            res.json(result);
        })
    }));

    route.patch("/:id", asyncHandler(async (req, res) => {
        await transaction(async (repo, tx) => {
            const {id} = req.params;
            const payload = {...req.body};

            if (id == null) {
                throw new BadRequest("record not found");
            }
            const existing = await repo.findOne({
                where: {
                    id: id as any,
                    ...buildParentCondition(req.params)
                },
                relations,
            });
            if (existing == null) {
                res.status(400).json({message: "Record not found"});
            }
            else {
                const result = await repo.save({
                    ...existing,
                    payload,
                    id
                });
                await afterUpdate?.(payload, result, repo, tx);
                res.json(result);
            }
        })
    }));

    route.delete("/:id", asyncHandler(async (req, res) => {
        await transaction(async (repo, tx) => {
            const {id} = req.params;
            if (id == null) {
                throw new BadRequest("id is missing");
            }
            const criteria = {id: id as any};
            const existing = await repo.findOneBy(criteria);
            if (existing == null) {
                throw new BadRequest("record not found");
            }
            await beforeDelete?.(existing, repo, tx);

            if (softDelete) {
                await repo.softDelete(criteria)
            }
            else {
                await repo.delete(criteria);
            }

            res.json(existing);
        })
    }));

    Object.keys(children).forEach((childRoute) => {
        route.use(`${childRoute}/:parentId`, children[childRoute]!)
    });

    return route;

    function buildParentCondition(params: Partial<Record<string, string>>): FindOptionsWhere<Entity> {
        if (parentIdField != null) {
            return {[parentIdField]: params["parentId"]} as FindOptionsWhere<Entity>;
        }
        return {};
    }
}

function paginationFromRequest(req: Request) {
    const start = parseInt(req.query["_start"] as string);
    const end = parseInt(req.query["_end"] as string);
    const skip = start;
    const take = end - start;
    return {skip, take};
}
