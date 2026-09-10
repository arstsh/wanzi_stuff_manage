import { prisma } from '../prisma/client.js';
import type { Prisma } from '@prisma/client';

export type CreateCategoryInput = Pick<Prisma.CategoryCreateInput, 'name' | 'description'>;
export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export const categoryRepository = {
  async create(data: CreateCategoryInput) {
    return prisma.category.create({ data });
  },

  async findById(id: number) {
    return prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { items: true } } },
    });
  },

  async findByName(name: string) {
    return prisma.category.findUnique({ where: { name } });
  },

  async findAll() {
    return prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { items: true } } },
    });
  },

  async update(id: number, data: UpdateCategoryInput) {
    return prisma.category.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.category.delete({ where: { id } });
  },
};
