import { z } from 'zod';
import { itemService } from '../services/itemService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const itemIdSchema = z.coerce.number().int().positive();
const listItemsSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().max(100).optional(),
    sortBy: z.enum(['id', 'name', 'sku', 'price', 'quantity', 'createdAt']).default('id'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    categoryId: z.coerce.number().int().positive().optional(),
});
const createItemSchema = z.object({
    name: z.string().min(1, '货品名称不能为空').max(200),
    sku: z.string().min(1, 'SKU 不能为空').max(100),
    description: z.string().max(2000).optional(),
    unit: z.string().max(20).default('件'),
    price: z.coerce.number().nonnegative().default(0),
    quantity: z.coerce.number().int().nonnegative().default(0),
    minQuantity: z.coerce.number().int().nonnegative().default(0),
    categoryId: z.coerce.number().int().positive(),
});
const updateItemSchema = createItemSchema.partial().omit({ sku: true });
const adjustStockSchema = z.object({
    type: z.enum(['IN', 'OUT']),
    quantity: z.coerce.number().int().positive(),
    note: z.string().max(255).optional(),
});
const logQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
});
export const itemController = {
    create: asyncHandler(async (req, res) => {
        const data = createItemSchema.parse(req.body);
        const item = await itemService.create(data);
        const response = { success: true, data: item };
        res.status(201).json(response);
    }),
    list: asyncHandler(async (req, res) => {
        const query = listItemsSchema.parse(req.query);
        const { items, total } = await itemService.list(query);
        const meta = {
            page: query.page,
            pageSize: query.pageSize,
            total,
            totalPages: Math.ceil(total / query.pageSize),
        };
        const response = { success: true, data: items, meta };
        res.json(response);
    }),
    getById: asyncHandler(async (req, res) => {
        const id = itemIdSchema.parse(req.params.id);
        const item = await itemService.getById(id);
        const response = { success: true, data: item };
        res.json(response);
    }),
    update: asyncHandler(async (req, res) => {
        const id = itemIdSchema.parse(req.params.id);
        const data = updateItemSchema.parse(req.body);
        const item = await itemService.update(id, data);
        const response = { success: true, data: item };
        res.json(response);
    }),
    delete: asyncHandler(async (req, res) => {
        const id = itemIdSchema.parse(req.params.id);
        await itemService.delete(id);
        const response = { success: true, data: null };
        res.json(response);
    }),
    adjustStock: asyncHandler(async (req, res) => {
        const id = itemIdSchema.parse(req.params.id);
        const data = adjustStockSchema.parse(req.body);
        const item = await itemService.adjustStock(id, data.type, data.quantity, data.note);
        const response = { success: true, data: item };
        res.json(response);
    }),
    getLogs: asyncHandler(async (req, res) => {
        const id = itemIdSchema.parse(req.params.id);
        const query = logQuerySchema.parse(req.query);
        const { logs, total } = await itemService.getLogs(id, query.page, query.pageSize);
        const meta = {
            page: query.page,
            pageSize: query.pageSize,
            total,
            totalPages: Math.ceil(total / query.pageSize),
        };
        const response = { success: true, data: logs, meta };
        res.json(response);
    }),
};
//# sourceMappingURL=itemController.js.map