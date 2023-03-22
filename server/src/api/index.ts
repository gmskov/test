import {Router} from "express";
import cookieParser from "cookie-parser";
import {Resource} from "./resource";
import {dsPromise} from "../db";
import {Person} from "../entities/Person";
import {EmployeeProfile} from "../entities/EmployeeProfile";
import {EmployeeSalary} from "../entities/EmployeeSalary";
import {Invoice} from "../entities/Invoice";
import {errorHandler} from "./errorHandler";
import {authMiddleware, authRouter} from "./auth";
import {User, UserRole} from "../entities/User";
import {generatePasswordHash} from "./auth/password";
import {Password} from "../entities/Password";
import {fileRouter} from "./file";
import {hasAccessRoles} from './hasAccessRoles';

export const apiRouter = Router();

apiRouter.use(authRouter);
apiRouter.use(cookieParser())

//From this point on all further endpoints require authentication
apiRouter.use(authMiddleware);

apiRouter.use("/persons", hasAccessRoles(), Resource(dsPromise, Person));

apiRouter.use("/employees", hasAccessRoles(), Resource(dsPromise, EmployeeProfile, {
    relations: {person: true},
}));

apiRouter.use("/employeeSalary", hasAccessRoles(), Resource(dsPromise, EmployeeSalary));

apiRouter.use("/invoices", hasAccessRoles(UserRole.USER), Resource(dsPromise, Invoice, {
    relations: {file: true}
}));

apiRouter.use("/users", hasAccessRoles(), Resource(dsPromise, User, {
    softDelete: true,
    afterCreate: async ({password}: any, user, repo, tx) => {
        const payload = new Password();
        Object.assign(payload, {
            ...generatePasswordHash(password),
            user_id: user.id
        });
        await tx.getRepository(Password).save(payload);
    },
    afterUpdate: async ({password}: any, user, repo, tx) => {
        if (typeof password === "string" && password.length > 0) {
            const passwordRepo = tx.getRepository(Password);
            let existing = await passwordRepo.findOneBy({user_id: user.id});
            if (existing == null) {
                existing = new Password();
                existing.user = user;
            }
            Object.assign(existing, generatePasswordHash(password));
            await passwordRepo.save(existing);
        }
    },
    beforeDelete: async (record, repo, tx) => {
        await tx.getRepository(Password).delete({user_id: record.id});
    }
}));

apiRouter.use("/file", hasAccessRoles(), fileRouter);

apiRouter.use(errorHandler);
