import { prisma } from '../prisma/client.js';
export const categoryRepository = {
    async create(data) {
        return prisma.category.create({ data });
    },
    async findById(id) {
        return prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { items: true } } },
        });
    },
    async findByName(name) {
        return prisma.category.findUnique({ where: { name } });
    },
    async findAll() {
        return prisma.category.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { items: true } } },
        });
    },
    async update(id, data) {
        return prisma.category.update({ where: { id }, data });
    },
    async delete(id) {
        return prisma.category.delete({ where: { id } });
    },
};
//# sourceMappingURL=categoryRepository.js.map