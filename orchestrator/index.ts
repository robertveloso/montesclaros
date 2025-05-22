import { db } from './db';
import { SuperkiloWorker } from '../harvester/supermarket/superkilo/worker';
import { CarrefourWorker } from '../harvester/supermarket/carrefour/worker';
import { Product } from '../harvester/types';

export class Orchestrator {
    private workers: Map<string, HarvesterWorker>;

    constructor() {
        this.workers = new Map();
        this.initializeWorkers();
    }

    private initializeWorkers() {
        // Initialize each worker with its own database connection
        this.workers.set('superkilo', new SuperkiloWorker());
        this.workers.set('carrefour', new CarrefourWorker());
    }

    async sync() {
        for (const [name, worker] of this.workers) {
            const lastSync = await worker.getLastSync();

            // Fetch new products from worker's database
            const products = await this.fetchNewProducts(name, lastSync);

            // Normalize and store in main database
            await this.normalizeAndStore(products);

            // Mark as synced
            await worker.markAsSynced();
        }
    }

    private async normalizeAndStore(products: Product[]) {
        // Implement normalization logic
        // This could include:
        // - Price normalization
        // - Category mapping
        // - Product matching
        // - History tracking
    }
}