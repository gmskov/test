import { NextFunction, Response, Request } from 'express';
import { User, UserRole } from '../entities/User'
import { dsPromise } from '../db'

export const hasAccessRoles = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if(req.auth != null) {
      const ds = await dsPromise;
      const user = await ds.getRepository(User).findOneBy({id: req.auth.id});

      if(user != null && user.role === UserRole.ADMIN) return next();
      if(user != null && allowedRoles.some(role => role === user.role)) return next();
    }

    res.status(403).send('Forbidden')
  }
}
