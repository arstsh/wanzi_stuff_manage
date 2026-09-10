import { type CreateCategoryInput, type UpdateCategoryInput } from '../repositories/categoryRepository.js';
export declare const categoryService: {
    create(data: CreateCategoryInput): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    list(): Promise<({
        _count: {
            items: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    })[]>;
    getById(id: number): Promise<{
        _count: {
            items: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    update(id: number, data: UpdateCategoryInput): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    delete(id: number): Promise<void>;
};
//# sourceMappingURL=categoryService.d.ts.map