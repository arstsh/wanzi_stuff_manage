export class AppError extends Error {
    statusCode;
    code;
    isOperational;
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class BadRequestError extends AppError {
    constructor(message = '请求参数错误', code = 'BAD_REQUEST') {
        super(message, 400, code);
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = '未登录或登录已过期', code = 'UNAUTHORIZED') {
        super(message, 401, code);
    }
}
export class ForbiddenError extends AppError {
    constructor(message = '权限不足', code = 'FORBIDDEN') {
        super(message, 403, code);
    }
}
export class NotFoundError extends AppError {
    constructor(message = '资源不存在', code = 'NOT_FOUND') {
        super(message, 404, code);
    }
}
export class ConflictError extends AppError {
    constructor(message = '资源冲突', code = 'CONFLICT') {
        super(message, 409, code);
    }
}
//# sourceMappingURL=errors.js.map