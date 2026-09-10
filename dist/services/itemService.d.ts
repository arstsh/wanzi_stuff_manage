import { type CreateItemInput, type UpdateItemInput } from '../repositories/itemRepository.js';
import type { LogType } from '@prisma/client';
interface ListItemsOptions {
    page: number;
    pageSize: number;
    search?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    categoryId?: number;
}
export declare const itemService: {
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
        price: import("@prisma/client/runtime/library").Decimal;
        quantity: number;
        minQuantity: number;
        categoryId: number;
    }>;
    list(options: ListItemsOptions): Promise<{
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
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            minQuantity: number;
            categoryId: number;
        })[];
        total: number;
    }>;
    getById(id: number): Promise<{
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
        price: import("@prisma/client/runtime/library").Decimal;
        quantity: number;
        minQuantity: number;
        categoryId: number;
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
        price: import("@prisma/client/runtime/library").Decimal;
        quantity: number;
        minQuantity: number;
        categoryId: number;
    }>;
    delete(id: number): Promise<void>;
    adjustStock(itemId: number, type: LogType, quantity: number, note?: string): Promise<{
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
        price: import("@prisma/client/runtime/library").Decimal;
        quantity: number;
        minQuantity: number;
        categoryId: number;
    }>;
    getLogs(itemId: number, page: number, pageSize: number): Promise<{
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
//# sourceMappingURL=itemService.d.ts.map