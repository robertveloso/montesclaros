import axios from 'axios';

export interface Product {
    externalId: string;
    description: string;
    image: string;
    price: number;
}

export async function fetchCarrefourProducts(category: string, branchId: string): Promise<Product[]> {
    try {
        const res = await axios.get(`https://api.carrefour.com.br/products`, {
            params: {
                cat: category,
                store: branchId
            },
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            }
        });

        return res.data.items.map((item: any) => ({
            externalId: item.id,
            description: item.name,
            image: item.imageUrl,
            price: item.price,
        }));
    } catch (error) {
        console.error(`Error fetching Carrefour products for category ${category} and branch ${branchId}:`, error);
        return [];
    }
}