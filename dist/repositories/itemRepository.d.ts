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
export declare const itemRepository: {
    create(data: CreateItemInput): Promise<{
        category: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        sku: string;
        unit: string;
        price: Prisma.Decimal;
        quantity: number;
        minQuantity: number;
        categoryId: number;
    }>;
    findById(id: number): Promise<({
        category: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        sku: string;
        unit: string;
        price: Prisma.Decimal;
        quantity: number;
        minQuantity: number;
        categoryId: number;
    }) | null>;
    findBySku(sku: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        sku: string;
        unit: string;
        price: Prisma.Decimal;
        quantity: number;
        minQuantity: number;
        categoryId: number;
    } | null>;
    findByName(name: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        sku: string;
        unit: string;
        price: Prisma.Decimal;
        quantity: number;
        minQuantity: number;
        categoryId: number;
    } | null>;
    findMany(params: ListItemsParams): Promise<{
        items: ({
            category: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            sku: string;
            unit: string;
            price: Prisma.Decimal;
            quantity: number;
            minQuantity: number;
            categoryId: number;
        })[];
        total: number;
    }>;
    update(id: number, data: UpdateItemInput): Promise<{
        category: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        sku: string;
        unit: string;
        price: Prisma.Decimal;
        quantity: number;
        minQuantity: number;
        categoryId: number;
    }>;
    delete(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        sku: string;
        unit: string;
        price: Prisma.Decimal;
        quantity: number;
        minQuantity: number;
        categoryId: number;
    }>;
    adjustStock(itemId: number, delta: number, type: LogType, note?: string): Promise<{
        category: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        sku: string;
        unit: string;
        price: Prisma.Decimal;
        quantity: number;
        minQuantity: number;
        categoryId: number;
    }>;
    findLogsByItemId(itemId: number, page: number, pageSize: number): Promise<{
        logs: {
            type: import(".prisma/client").$Enums.LogType;
            id: number;
            createdAt: Date;
            quantity: number;
            note: string | null;
            itemId: number;
        }[];
        total: number;
    }>;
};
export {};
//# sourceMappingURL=itemRepository.d.ts.map