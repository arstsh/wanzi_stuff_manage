import type { Request, Response } from 'express';
import { z } from 'zod';
import { categoryService } from '../services/categoryService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { ApiResponse } from '../types/index.js';

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
  create: asyncHandler(async (req: Request, res: Response) => {
    const data = createCategorySchema.parse(req.body);
    const category = await categoryService.create(data);
    const response: ApiResponse<typeof category> = { success: true, data: category };
    res.status(201).json(response);
  }),

  list: asyncHandler(async (_req: Request, res: Response) => {
    const categories = await categoryService.list();
    const response: ApiResponse<typeof categories> = { success: true, data: categories };
    res.json(response);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = categoryIdSchema.parse(req.params.id);
    const category = await categoryService.getById(id);
    const response: ApiResponse<typeof category> = { success: true, data: category };
    res.json(response);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = categoryIdSchema.parse(req.params.id);
    const data = updateCategorySchema.parse(req.body);
    const category = await categoryService.update(id, data);
    const response: ApiResponse<typeof category> = { success: true, data: category };
    res.json(response);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = categoryIdSchema.parse(req.params.id);
    await categoryService.delete(id);
    const response: ApiResponse<null> = { success: true, data: null };
    res.json(response);
  }),
};
