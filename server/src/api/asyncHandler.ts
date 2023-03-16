import {Request, Response, NextFunction, RequestHandler} from "express-serve-static-core";

export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler {
    return async (req, res, next) => {
        try {
            await fn(req, res, next)
        }
        catch (e){
            next(e);
        }
    }
}
