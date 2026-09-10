import { prisma } from '../prisma/client.js';
export const itemRepository = {
    async create(data) {
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
    async findById(id) {
        return prisma.item.findUnique({
            where: { id },
            include: { category: true },
        });
    },
    async findBySku(sku) {
        return prisma.item.findUnique({ where: { sku } });
    },
    async findByName(name) {
        return prisma.item.findFirst({ where: { name } });
    },
    async findMany(params) {
        const { page, pageSize, search, sortBy, sortOrder, categoryId } = params;
        const where = {
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
    async update(id, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.sku !== undefined)
            updateData.sku = data.sku;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.unit !== undefined)
            updateData.unit = data.unit;
        if (data.price !== undefined)
            updateData.price = data.price;
        if (data.minQuantity !== undefined)
            updateData.minQuantity = data.minQuantity;
        if (data.categoryId !== undefined)
            updateData.category = { connect: { id: data.categoryId } };
        return prisma.item.update({
            where: { id },
            data: updateData,
            include: { category: true },
        });
    },
    async delete(id) {
        return prisma.item.delete({ where: { id } });
    },
    async adjustStock(itemId, delta, type, note) {
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
    async findLogsByItemId(itemId, page, pageSize) {
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
//# sourceMappingURL=itemRepository.js.map