import { prisma } from '../prisma/client.js';
import type { Prisma, LogType } from '@prisma/client';

export type CreateItemInput = {
  name: string;
  sku: string;
  description?: string;
  unit?: string;
  price?: number;
  quantity?: number;
  minQuantity?: number;
  categoryId: number;
};

export type UpdateItemInput = Partial<CreateItemInput>;

interface ListItemsParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  categoryId?: number;
}

export const itemRepository = {
  async create(data: CreateItemInput) {
    return prisma.item.create({
      data: {
        name: data.name,
        sku: data.sku,
        description: data.description,
        unit: data.unit ?? '件',
        price: data.price ?? 0,
        quantity: data.quantity ?? 0,
        minQuantity: data.minQuantity ?? 0,
        categoryId: data.categoryId,
      },
      include: { category: true },
    });
  },

  async findById(id: number) {
    return prisma.item.findUnique({
      where: { id },
      include: { category: true },
    });
  },

  async findBySku(sku: string) {
    return prisma.item.findUnique({ where: { sku } });
  },

  async findByName(name: string) {
    return prisma.item.findFirst({ where: { name } });
  },

  async findMany(params: ListItemsParams) {
    const { page, pageSize, search, sortBy, sortOrder, categoryId } = params;
    const where: Prisma.ItemWhereInput = {
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { sku: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {}),
      ...(categoryId ? { categoryId } : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.item.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
        include: { category: true },
      }),
      prisma.item.count({ where }),
    ]);

    return { items, total };
  },

  async update(id: number, data: UpdateItemInput) {
    const updateData: Prisma.ItemUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.minQuantity !== undefined) updateData.minQuantity = data.minQuantity;
    if (data.categoryId !== undefined) updateData.category = { connect: { id: data.categoryId } };

    return prisma.item.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });
  },

  async delete(id: number) {
    return prisma.item.delete({ where: { id } });
  },

  async adjustStock(itemId: number, delta: number, type: LogType, note?: string) {
    return prisma.$transaction(async (tx) => {
      const item = await tx.item.update({
        where: { id: itemId },
        data: { quantity: { increment: delta } },
        include: { category: true },
      });

      await tx.inventoryLog.create({
        data: {
          itemId,
          type,
          quantity: Math.abs(delta),
          note,
        },
      });

      return item;
    });
  },

  async findLogsByItemId(itemId: number, page: number, pageSize: number) {
    const [logs, total] = await prisma.$transaction([
      prisma.inventoryLog.findMany({
        where: { itemId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.inventoryLog.count({ where: { itemId } }),
    ]);
    return { logs, total };
  },
};
