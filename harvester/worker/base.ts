import { Product } from '../types';

export interface HarvesterWorker {
    fetchProducts(category: string, branchId: string): Promise<Product[]>;
    getLastSync(): Promise<Date>;
    markAsSynced(): Promise<void>;
}

export interface WorkerConfig {
    name: string;
    type: 'api' | 'browser' | 'custom';
    syncInterval: number;
    database: {
        host: string;
        port: number;
        name: string;
    };
}