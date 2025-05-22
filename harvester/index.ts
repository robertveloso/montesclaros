import { db } from './db';
import { branchOffice, company } from './schema';
import { persistProduct } from './persist';

import { eq } from 'drizzle-orm';
import axios from 'axios';

const CATEGORIES = ['mercearia', 'bebidas', 'limpeza', 'higiene', 'pet'];
const SUPERMARKET_SERVICE_URL = process.env.SUPERMARKET_SERVICE_URL || 'http://localhost:3000';

type Product = {
    externalId: string;
    description: string;
    image: string;
    price: number;
}

async function fetchSupermarketProducts(category: string, branchId: string, supermarket: string): Promise<Product[]> {
    try {
        const response = await axios.post(`${SUPERMARKET_SERVICE_URL}/api/products`, {
            category,
            branchId,
            supermarket
        });
        return response.data.products;
    } catch (error) {
        console.error(`Error fetching products from ${supermarket}:`, error);
        return [];
    }
}

async function main() {
    console.log('Starting harvester...');

    try {
        const companies = await db.select().from(company);
        console.log(`Found ${companies.length} companies`);

        for (const c of companies) {
            console.log(`Processing company: ${c.name}`);
            const branches = await db.select()
                .from(branchOffice)
                .where(eq(branchOffice.idCompany, c.id));

            console.log(`Found ${branches.length} branches for ${c.name}`);

            for (const b of branches) {
                console.log(`Processing branch: ${b.name}`);

                for (const cat of CATEGORIES) {
                    console.log(`Processing category: ${cat}`);
                    let products: Product[] = [];

                    // Get supermarket name from company name
                    const supermarket = c.name.toLowerCase();
                    products = await fetchSupermarketProducts(cat, b.externalId, supermarket);

                    console.log(`Found ${products.length} products for ${cat}`);

                    for (const p of products) {
                        await persistProduct({
                            ...p,
                            branchId: b.id,
                            category: cat
                        });
                    }
                }
            }
        }

        console.log('Harvesting completed successfully');
    } catch (error) {
        console.error('Error during harvesting:', error);
    }
}

main().catch(console.error);