"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const express_1 = require("express");
const asyncHandler_1 = require("./asyncHandler");
const http_errors_1 = require("http-errors");
function Resource(managerPromise, target, { relations, children = {}, softDelete, parentIdField, afterCreate, afterUpdate, beforeDelete, } = {}) {
    const route = (0, express_1.Router)();
    function transaction(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            const manager = yield managerPromise;
            yield manager.transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                return yield fn(tx.getRepository(target), tx);
            }));
        });
    }
    route.get("/", (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        yield transaction((repo) => __awaiter(this, void 0, void 0, function* () {
            const result = yield repo.find(Object.assign(Object.assign({}, paginationFromRequest(req)), { relations, where: buildParentCondition(req.params) }));
            res.json(result);
        }));
    })));
    route.get("/:id", (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        yield transaction((repo) => __awaiter(this, void 0, void 0, function* () {
            const result = yield repo.findOne({
                where: Object.assign(Object.assign({}, buildParentCondition(req.params)), { id: req.params['id'] }),
                relations,
            });
            if (result == null) {
                res.status(404).end();
            }
            else {
                res.json(result);
            }
        }));
    })));
    route.post("/", (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        yield transaction((repo, tx) => __awaiter(this, void 0, void 0, function* () {
            let payload = Object.assign({}, req.body);
            if (parentIdField != null) {
                payload[parentIdField] = req.params['parentId'];
            }
            const result = yield repo.save(payload);
            yield (afterCreate === null || afterCreate === void 0 ? void 0 : afterCreate(payload, result, repo, tx));
            res.json(result);
        }));
    })));
    route.patch("/:id", (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        yield transaction((repo, tx) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const payload = Object.assign({}, req.body);
            if (id == null) {
                throw new http_errors_1.BadRequest("record not found");
            }
            const existing = yield repo.findOne({
                where: Object.assign({ id: id }, buildParentCondition(req.params)),
                relations,
            });
            if (existing == null) {
                res.status(400).json({ message: "Record not found" });
            }
            else {
                const result = yield repo.save(Object.assign(Object.assign({}, existing), { payload,
                    id }));
                yield (afterUpdate === null || afterUpdate === void 0 ? void 0 : afterUpdate(payload, result, repo, tx));
                res.json(result);
            }
        }));
    })));
    route.delete("/:id", (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
        yield transaction((repo, tx) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (id == null) {
                throw new http_errors_1.BadRequest("id is missing");
            }
            const criteria = { id: id };
            const existing = yield repo.findOneBy(criteria);
            if (existing == null) {
                throw new http_errors_1.BadRequest("record not found");
            }
            yield (beforeDelete === null || beforeDelete === void 0 ? void 0 : beforeDelete(existing, repo, tx));
            if (softDelete) {
                yield repo.softDelete(criteria);
            }
            else {
                yield repo.delete(criteria);
            }
            res.json(existing);
        }));
    })));
    Object.keys(children).forEach((childRoute) => {
        route.use(`${childRoute}/:parentId`, children[childRoute]);
    });
    return route;
    function buildParentCondition(params) {
        if (parentIdField != null) {
            return { [parentIdField]: params["parentId"] };
        }
        return {};
    }
}
exports.Resource = Resource;
function paginationFromRequest(req) {
    const start = parseInt(req.query["_start"]);
    const end = parseInt(req.query["_end"]);
    const skip = start;
    const take = end - start;
    return { skip, take };
}
