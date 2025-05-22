import { Hono } from 'hono';
import { SuperkiloWorker } from './worker';

const app = new Hono();

app.post('/sync', async (c) => {
    try {
        const { category, branchId } = await c.req.json();
        const products = await SuperkiloWorker.fetchProducts(category, branchId);
        return c.json({ success: true, count: products.length });
    } catch (error) {
        return c.json({ success: false, error: error.message }, 500);
    }
});

app.get('/status', async (c) => {
    const lastSync = await SuperkiloWorker.getLastSync();
    return c.json({ lastSync });
});

export default app;