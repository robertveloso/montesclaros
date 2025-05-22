import { db } from './db';

import { eq } from 'drizzle-orm';

import { product, productGroup } from './schema';
import { isSameProduct } from './match';

export interface ProductData {
    description: string;
    image: string;
    price: number;
    branchId: number;
    category: string;
    externalId: string;
}

export async function persistProduct(data: ProductData) {
    const existingGroups = await db.select().from(productGroup);
    let groupId: number | null = null;

    for (const g of existingGroups) {
        if (isSameProduct(g.description, data.description)) {
            groupId = g.id;
            break;
        }
    }

    if (!groupId) {
        const [group] = await db.insert(productGroup).values({
            description: data.description,
            image: data.image,
            price: data.price,
            updatedAt: new Date(),
            category: data.category,
        }).returning();
        groupId = group.id;
    } else {
        await db.update(productGroup)
            .set({
                price: data.price,
                updatedAt: new Date(),
            })
            .where(eq(productGroup.id, groupId));
    }

    await db.insert(product).values({
        description: data.description,
        image: data.image,
        price: data.price,
        updatedAt: new Date(),
        idBranchOffice: data.branchId,
        idProductGroup: groupId,
        externalId: data.externalId
    });
}