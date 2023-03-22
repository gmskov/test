import { JwtUserPayload } from '../../api/auth/jwt'

export {}

declare global {
  namespace Express {
    export interface Request {
      auth?: JwtUserPayload
    }
  }
}
