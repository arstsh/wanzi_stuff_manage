import type { Request, Response, NextFunction } from 'express';
export declare const authController: {
    register: (req: Request, res: Response, next: NextFunction) => void;
    login: (req: Request, res: Response, next: NextFunction) => void;
    refresh: (req: Request, res: Response, next: NextFunction) => void;
    logout: (req: Request, res: Response, next: NextFunction) => void;
    me: (req: Request, res: Response, next: NextFunction) => void;
};
//# sourceMappingURL=authController.d.ts.map