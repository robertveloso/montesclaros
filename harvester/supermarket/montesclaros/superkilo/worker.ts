import { db } from './db';

import type { Product, SyncLog } from './types';

import { Scraper } from './services/index';
import * as schema from './schema';

class SuperkiloWorker {
    static async fetchProducts(category: string, branchId: string): Promise<Product[]> {
        // Implement Superkilo specific scraping logic
        const products = await Scraper.getProductList();
        await SuperkiloWorker.persistProducts(products);

        await SuperkiloWorker.persistSyncLog({
            status: 'success',
            productsCount: products.length,
            category,
            branchId
        });

        return products;
    }

    static async getLastSync(): Promise<Date> {
        const result = await db.query.syncLog.findFirst({
            orderBy: (log) => log.timestamp
        });

        return result?.timestamp || new Date(0);
    }

    static async persistProducts(products: Product[]) {
        await db.insert(schema.product).values(products.map(product => ({
            ...product,
            updatedAt: new Date(),
            price: product.price.toString()
        })));
    }

    static async persistSyncLog(syncLog: SyncLog) {
        await db.insert(schema.syncLog).values(syncLog);
    }
}

export { SuperkiloWorker };