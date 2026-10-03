export const up = (pgm) => {
    pgm.addColumn('idempotency_keys', {
        status: {
            type: 'varchar(20)',
            notNull: true,
            default: 'processing',
        },
    });

    pgm.createIndex('idempotency_keys', ['merchant_id', 'status']);
};

export const down = (pgm) => {
    pgm.dropIndex('idempotency_keys', ['merchant_id', 'status']);

    pgm.dropColumn('idempotency_keys', 'status');
};
