import winston from 'winston';
import { config } from '../config/index.js';
const { combine, timestamp, json, errors } = winston.format;
export const logger = winston.createLogger({
    level: config.NODE_ENV === 'production' ? 'info' : 'debug',
    defaultMeta: { service: 'wanzi-inventory-backend' },
    format: combine(timestamp(), errors({ stack: config.NODE_ENV === 'development' }), json()),
    transports: [new winston.transports.Console()],
});
//# sourceMappingURL=logger.js.map