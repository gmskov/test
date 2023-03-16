import {ErrorRequestHandler} from "express";
import {isHttpError} from "http-errors";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (isHttpError(err)) {
        res.status(err.status).send(err.message);
    }
    else {
        res.status(500).send(err.toString());
    }
}
