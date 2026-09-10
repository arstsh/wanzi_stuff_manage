import type { Prisma } from '@prisma/client';
export type CreateCategoryInput = Pick<Prisma.CategoryCreateInput, 'name' | 'description'>;
export type UpdateCategoryInput = Partial<CreateCategoryInput>;
export declare const categoryRepository: {
    create(data: CreateCategoryInput): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    findById(id: number): Promise<({
        _count: {
            items: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }) | null>;
    findByName(name: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    } | null>;
    findAll(): Promise<({
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
    update(id: number, data: UpdateCategoryInput): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    delete(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
};
//# sourceMappingURL=categoryRepository.d.ts.map