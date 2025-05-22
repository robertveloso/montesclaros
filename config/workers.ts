export const workerConfigs = {
    superkilo: {
        name: 'superkilo',
        type: 'browser',
        syncInterval: 3600000, // 1 hour
        database: {
            host: process.env.SUPERKILO_DB_HOST,
            port: parseInt(process.env.SUPERKILO_DB_PORT),
            name: 'superkilo_worker'
        }
    },
    carrefour: {
        name: 'carrefour',
        type: 'api',
        syncInterval: 1800000, // 30 minutes
        database: {
            host: process.env.CARREFOUR_DB_HOST,
            port: parseInt(process.env.CARREFOUR_DB_PORT),
            name: 'carrefour_worker'
        }
    }
};