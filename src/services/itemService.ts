import { itemRepository, type CreateItemInput, type UpdateItemInput } from '../repositories/itemRepository.js';
import { categoryService } from './categoryService.js';
import { BadRequestError, NotFoundError, ConflictError } from '../utils/errors.js';
import type { LogType } from '@prisma/client';

interface ListItemsOptions {
  page: number;
  pageSize: number;
  search?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  categoryId?: number;
}

const validSortFields = new Set(['id', 'name', 'sku', 'price', 'quantity', 'createdAt']);

export const itemService = {
  async create(data: CreateItemInput) {
    await categoryService.getById(data.categoryId);

    const [skuExists, nameExists] = await Promise.all([
      itemRepository.findBySku(data.sku),
      itemRepository.findByName(data.name),
    ]);

    if (skuExists) throw new ConflictError('SKU 已存在');
    if (nameExists) throw new ConflictError('货品名称已存在');

    return itemRepository.create(data);
  },

  async list(options: ListItemsOptions) {
    if (!validSortFields.has(options.sortBy)) {
      throw new BadRequestError('非法排序字段');
    }
    if (options.page < 1) throw new BadRequestError('page 必须 ≥ 1');
    if (options.pageSize < 1 || options.pageSize > 100) throw new BadRequestError('pageSize 范围 1-100');

    if (options.categoryId) {
      await categoryService.getById(options.categoryId);
    }

    return itemRepository.findMany(options);
  },

  async getById(id: number) {
    const item = await itemRepository.findById(id);
    if (!item) {
      throw new NotFoundError('货品不存在');
    }
    return item;
  },

  async update(id: number, data: UpdateItemInput) {
    const item = await this.getById(id);

    if (data.categoryId) {
      await categoryService.getById(data.categoryId);
    }

    if (data.sku && data.sku !== item.sku) {
      const skuExists = await itemRepository.findBySku(data.sku);
      if (skuExists) throw new ConflictError('SKU 已存在');
    }

    if (data.name && data.name !== item.name) {
      const nameExists = await itemRepository.findByName(data.name);
      if (nameExists) throw new ConflictError('货品名称已存在');
    }

    return itemRepository.update(id, data);
  },

  async delete(id: number) {
    await this.getById(id);
    await itemRepository.delete(id);
  },

  async adjustStock(itemId: number, type: LogType, quantity: number, note?: string) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestError('数量必须是正整数');
    }

    const item = await this.getById(itemId);
    const delta = type === 'IN' ? quantity : -quantity;

    if (type === 'OUT' && item.quantity + delta < 0) {
      throw new BadRequestError('库存不足，无法出库');
    }

    return itemRepository.adjustStock(itemId, delta, type, note);
  },

  async getLogs(itemId: number, page: number, pageSize: number) {
    await this.getById(itemId);
    return itemRepository.findLogsByItemId(itemId, page, pageSize);
  },
};
