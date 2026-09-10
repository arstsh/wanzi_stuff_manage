import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { requestId } from './middleware/requestId.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiRoutes } from './routes/index.js';
export function createApp() {
    const app = express();
    // 安全头
    app.use(helmet());
    // CORS：生产环境必须显式指定来源
    app.use(cors({
        origin: config.ALLOWED_ORIGINS,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    // 请求限速
    app.use(rateLimit({
        windowMs: config.RATE_LIMIT_WINDOW_MS,
        max: config.RATE_LIMIT_MAX,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (_req, res) => {
            res.status(429).json({ success: false, error: '请求过于频繁，请稍后再试' });
        },
    }));
    // 基础中间件
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));
    app.use(cookieParser());
    app.use(requestId);
    // 健康检查（负载均衡/监控用）
    app.get('/health', (_req, res) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    app.get('/ready', (_req, res) => {
        res.status(200).json({ status: 'ready' });
    });
    // API 路由
    app.use('/api/v1', apiRoutes);
    // 404
    app.use((_req, res) => {
        res.status(404).json({ success: false, error: '接口不存在' });
    });
    // 全局错误处理（必须放在最后）
    app.use(errorHandler);
    return app;
}
export function startApp() {
    const app = createApp();
    const server = app.listen(config.PORT, () => {
        logger.info(`Server listening on port ${config.PORT}`, {
            port: config.PORT,
            nodeEnv: config.NODE_ENV,
        });
    });
    // 优雅停机
    const shutdown = (signal) => {
        logger.info(`Received ${signal}, shutting down gracefully...`);
        server.close(() => {
            logger.info('Server closed');
            process.exit(0);
        });
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    return server;
}
//# sourceMappingURL=app.js.map