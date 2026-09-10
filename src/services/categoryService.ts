import { categoryRepository, type CreateCategoryInput, type UpdateCategoryInput } from '../repositories/categoryRepository.js';
import { BadRequestError, NotFoundError, ConflictError } from '../utils/errors.js';

export const categoryService = {
  async create(data: CreateCategoryInput) {
    const existing = await categoryRepository.findByName(data.name);
    if (existing) {
      throw new ConflictError('分类名称已存在');
    }
    return categoryRepository.create(data);
  },

  async list() {
    return categoryRepository.findAll();
  },

  async getById(id: number) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('分类不存在');
    }
    return category;
  },

  async update(id: number, data: UpdateCategoryInput) {
    await this.getById(id);
    if (data.name) {
      const existing = await categoryRepository.findByName(data.name);
      if (existing && existing.id !== id) {
        throw new ConflictError('分类名称已存在');
      }
    }
    return categoryRepository.update(id, data);
  },

  async delete(id: number) {
    const category = await this.getById(id);
    if ((category._count?.items ?? 0) > 0) {
      throw new BadRequestError('该分类下还有货品，不能删除');
    }
    await categoryRepository.delete(id);
  },
};
