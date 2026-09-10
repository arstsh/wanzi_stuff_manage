import type { Request, Response, NextFunction } from 'express';
export interface JwtPayload {
    userId: number;
    username: string;
    role: 'ADMIN' | 'USER';
}
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export declare function authenticate(req: Request, _res: Response, next: NextFunction): void;
export declare function requireAdmin(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map