import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { UnauthorizedError } from '../utils/errors.js';
export function authenticate(req, _res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
        next(new UnauthorizedError('缺少访问令牌'));
        return;
    }
    try {
        const payload = jwt.verify(token, config.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch {
        next(new UnauthorizedError('访问令牌无效或已过期'));
    }
}
export function requireAdmin(req, _res, next) {
    if (req.user?.role !== 'ADMIN') {
        next(new UnauthorizedError('需要管理员权限'));
        return;
    }
    next();
}
//# sourceMappingURL=auth.js.map