import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../prisma/client.js';
import { config } from '../config/index.js';
import { UnauthorizedError, ConflictError } from '../utils/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const loginSchema = z.object({
    username: z.string().min(1, '用户名不能为空'),
    password: z.string().min(1, '密码不能为空'),
});
const registerSchema = z.object({
    username: z.string().min(3, '用户名至少 3 位').max(50),
    password: z.string().min(6, '密码至少 6 位'),
    role: z.enum(['ADMIN', 'USER']).default('USER'),
});
const REFRESH_TOKEN_COOKIE = 'refreshToken';
function signAccessToken(payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
    });
}
function signRefreshToken(payload) {
    return jwt.sign(payload, config.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}
export const authController = {
    register: asyncHandler(async (req, res, _next) => {
        const input = registerSchema.parse(req.body);
        const existing = await prisma.user.findUnique({
            where: { username: input.username },
        });
        if (existing) {
            throw new ConflictError('用户名已存在');
        }
        const passwordHash = await bcrypt.hash(input.password, 10);
        const user = await prisma.user.create({
            data: {
                username: input.username,
                passwordHash,
                role: input.role,
            },
            select: { id: true, username: true, role: true, createdAt: true },
        });
        const response = {
            success: true,
            data: user,
        };
        res.status(201).json(response);
    }),
    login: asyncHandler(async (req, res, _next) => {
        const input = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { username: input.username } });
        if (!user) {
            throw new UnauthorizedError('用户名或密码错误');
        }
        const valid = await bcrypt.compare(input.password, user.passwordHash);
        if (!valid) {
            throw new UnauthorizedError('用户名或密码错误');
        }
        const accessToken = signAccessToken({
            userId: user.id,
            username: user.username,
            role: user.role,
        });
        const refreshToken = signRefreshToken({ userId: user.id });
        await prisma.refreshToken.create({
            data: {
                tokenHash: await bcrypt.hash(refreshToken, 10),
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const response = {
            success: true,
            data: {
                accessToken,
                user: { id: user.id, username: user.username, role: user.role },
            },
        };
        res.json(response);
    }),
    refresh: asyncHandler(async (req, res, _next) => {
        const token = req.cookies[REFRESH_TOKEN_COOKIE];
        if (!token) {
            throw new UnauthorizedError('缺少刷新令牌');
        }
        let payload;
        try {
            payload = jwt.verify(token, config.REFRESH_TOKEN_SECRET);
        }
        catch {
            throw new UnauthorizedError('刷新令牌无效');
        }
        const tokens = await prisma.refreshToken.findMany({
            where: { userId: payload.userId },
            orderBy: { createdAt: 'desc' },
        });
        let matched = false;
        let matchedId = null;
        for (const t of tokens) {
            if (await bcrypt.compare(token, t.tokenHash)) {
                matched = true;
                matchedId = t.id;
                break;
            }
        }
        if (!matched || matchedId === null) {
            throw new UnauthorizedError('刷新令牌不存在');
        }
        const user = await prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user) {
            throw new UnauthorizedError('用户不存在');
        }
        const accessToken = signAccessToken({
            userId: user.id,
            username: user.username,
            role: user.role,
        });
        const newRefreshToken = signRefreshToken({ userId: user.id });
        await prisma.$transaction(async (tx) => {
            await tx.refreshToken.delete({ where: { id: matchedId } });
            await tx.refreshToken.create({
                data: {
                    tokenHash: await bcrypt.hash(newRefreshToken, 10),
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });
        });
        res.cookie(REFRESH_TOKEN_COOKIE, newRefreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const response = {
            success: true,
            data: { accessToken },
        };
        res.json(response);
    }),
    logout: asyncHandler(async (req, res, _next) => {
        const token = req.cookies[REFRESH_TOKEN_COOKIE];
        if (token) {
            const tokens = await prisma.refreshToken.findMany({
                select: { id: true, tokenHash: true },
            });
            for (const t of tokens) {
                if (await bcrypt.compare(token, t.tokenHash)) {
                    await prisma.refreshToken.delete({ where: { id: t.id } });
                    break;
                }
            }
        }
        res.clearCookie(REFRESH_TOKEN_COOKIE);
        const response = { success: true, data: null };
        res.json(response);
    }),
    me: asyncHandler(async (req, res, _next) => {
        const response = {
            success: true,
            data: {
                userId: req.user.userId,
                username: req.user.username,
                role: req.user.role,
            },
        };
        res.json(response);
    }),
};
//# sourceMappingURL=authController.js.map