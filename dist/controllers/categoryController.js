import { z } from 'zod';
import { categoryService } from '../services/categoryService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const categoryIdSchema = z.coerce.number().int().positive();
const createCategorySchema = z.object({
    name: z.string().min(1, '分类名称不能为空').max(100),
    description: z.string().max(500).optional(),
});
const updateCategorySchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
});
export const categoryController = {
    create: asyncHandler(async (req, res) => {
        const data = createCategorySchema.parse(req.body);
        const category = await categoryService.create(data);
        const response = { success: true, data: category };
        res.status(201).json(response);
    }),
    list: asyncHandler(async (_req, res) => {
        const categories = await categoryService.list();
        const response = { success: true, data: categories };
        res.json(response);
    }),
    getById: asyncHandler(async (req, res) => {
        const id = categoryIdSchema.parse(req.params.id);
        const category = await categoryService.getById(id);
        const response = { success: true, data: category };
        res.json(response);
    }),
    update: asyncHandler(async (req, res) => {
        const id = categoryIdSchema.parse(req.params.id);
        const data = updateCategorySchema.parse(req.body);
        const category = await categoryService.update(id, data);
        const response = { success: true, data: category };
        res.json(response);
    }),
    delete: asyncHandler(async (req, res) => {
        const id = categoryIdSchema.parse(req.params.id);
        await categoryService.delete(id);
        const response = { success: true, data: null };
        res.json(response);
    }),
};
//# sourceMappingURL=categoryController.js.map