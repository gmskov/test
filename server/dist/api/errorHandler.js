"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_errors_1 = require("http-errors");
const errorHandler = (err, req, res, next) => {
    if ((0, http_errors_1.isHttpError)(err)) {
        res.status(err.status).send(err.message);
    }
    else {
        res.status(500).send(err.toString());
    }
};
exports.errorHandler = errorHandler;
