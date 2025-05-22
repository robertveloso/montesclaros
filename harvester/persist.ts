import { db } from './db';
import { product, productGroup } from './schema';

export interface ProductData {
    description: string;
    image: string;
    price: number;
    branchId: number;
    category: string;
    externalId: string;
}

export async function persistProduct(data: ProductData) {
    const [group] = await db.insert(productGroup).values({
        description: data.description,
        image: data.image,
        price: data.price,
        updatedAt: new Date(),
        category: data.category,
    }).returning();

    await db.insert(product).values({
        description: data.description,
        image: data.image,
        price: data.price,
        updatedAt: new Date(),
        idBranchOffice: data.branchId,
        idProductGroup: group.id,
        externalId: data.externalId
    });
}