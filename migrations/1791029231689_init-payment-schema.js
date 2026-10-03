export const up = (pgm) => {
    pgm.createExtension('pgcrypto', {
        ifNotExists: true,
    });

    // --------------------------------------------------
    // MERCHANTS
    // --------------------------------------------------

    pgm.createTable('merchants', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },

        name: {
            type: 'varchar(255)',
            notNull: true,
        },

        status: {
            type: 'varchar(20)',
            notNull: true,
            default: 'active',
        },

        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },

        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
    });

    // --------------------------------------------------
    // PSPS
    // --------------------------------------------------

    pgm.createTable('psps', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },

        name: {
            type: 'varchar(100)',
            notNull: true,
            unique: true,
        },

        code: {
            type: 'varchar(50)',
            notNull: true,
            unique: true,
        },

        status: {
            type: 'varchar(20)',
            notNull: true,
            default: 'active',
        },

        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },

        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
    });

    // --------------------------------------------------
    // PAYMENTS
    // --------------------------------------------------

    pgm.createTable('payments', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },

        merchant_id: {
            type: 'uuid',
            notNull: true,
            references: 'merchants(id)',
            onDelete: 'RESTRICT',
        },

        amount: {
            type: 'bigint',
            notNull: true,
        },

        currency: {
            type: 'varchar(3)',
            notNull: true,
        },

        payment_method: {
            type: 'varchar(50)',
            notNull: true,
        },

        status: {
            type: 'varchar(30)',
            notNull: true,
            default: 'created',
        },

        description: {
            type: 'text',
        },

        metadata: {
            type: 'jsonb',
            notNull: true,
            default: pgm.func("'{}'::jsonb"),
        },

        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },

        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
    });

    // --------------------------------------------------
    // PAYMENT ATTEMPTS
    // --------------------------------------------------

    pgm.createTable('payment_attempts', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },

        payment_id: {
            type: 'uuid',
            notNull: true,
            references: 'payments(id)',
            onDelete: 'RESTRICT',
        },

        psp_id: {
            type: 'uuid',
            notNull: true,
            references: 'psps(id)',
            onDelete: 'RESTRICT',
        },

        attempt_number: {
            type: 'integer',
            notNull: true,
        },

        status: {
            type: 'varchar(30)',
            notNull: true,
            default: 'created',
        },

        psp_transaction_id: {
            type: 'varchar(255)',
        },

        request_id: {
            type: 'varchar(255)',
        },

        failure_code: {
            type: 'varchar(100)',
        },

        failure_message: {
            type: 'text',
        },

        request_payload: {
            type: 'jsonb',
        },

        response_payload: {
            type: 'jsonb',
        },

        latency_ms: {
            type: 'integer',
        },

        started_at: {
            type: 'timestamptz',
        },

        completed_at: {
            type: 'timestamptz',
        },

        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
    });

    // --------------------------------------------------
    // IDEMPOTENCY KEYS
    // --------------------------------------------------

    pgm.createTable('idempotency_keys', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },

        merchant_id: {
            type: 'uuid',
            notNull: true,
            references: 'merchants(id)',
            onDelete: 'RESTRICT',
        },

        idempotency_key: {
            type: 'varchar(255)',
            notNull: true,
        },

        request_hash: {
            type: 'varchar(64)',
            notNull: true,
        },

        payment_id: {
            type: 'uuid',
            references: 'payments(id)',
            onDelete: 'RESTRICT',
        },

        response_status: {
            type: 'integer',
        },

        response_body: {
            type: 'jsonb',
        },

        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },

        expires_at: {
            type: 'timestamptz',
        },
    });

    // --------------------------------------------------
    // WEBHOOK EVENTS
    // --------------------------------------------------

    pgm.createTable('webhook_events', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },

        psp_id: {
            type: 'uuid',
            notNull: true,
            references: 'psps(id)',
            onDelete: 'RESTRICT',
        },

        event_id: {
            type: 'varchar(255)',
            notNull: true,
        },

        event_type: {
            type: 'varchar(100)',
            notNull: true,
        },

        payment_id: {
            type: 'uuid',
            references: 'payments(id)',
            onDelete: 'SET NULL',
        },

        payload: {
            type: 'jsonb',
            notNull: true,
        },

        processed: {
            type: 'boolean',
            notNull: true,
            default: false,
        },

        processed_at: {
            type: 'timestamptz',
        },

        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
    });

    // --------------------------------------------------
    // INDEXES
    // --------------------------------------------------

    pgm.createIndex('payments', 'merchant_id');

    pgm.createIndex('payments', 'status');

    pgm.createIndex('payments', ['merchant_id', 'created_at']);

    pgm.createIndex('payment_attempts', 'payment_id');

    pgm.createIndex('payment_attempts', ['payment_id', 'attempt_number']);

    pgm.createIndex('payment_attempts', 'psp_id');

    pgm.createIndex('webhook_events', 'psp_id');

    pgm.createIndex('webhook_events', 'payment_id');

    // --------------------------------------------------
    // CONSTRAINTS
    // --------------------------------------------------

    pgm.addConstraint('idempotency_keys', 'unique_merchant_idempotency_key', {
        unique: ['merchant_id', 'idempotency_key'],
    });

    pgm.addConstraint('webhook_events', 'unique_psp_event_id', {
        unique: ['psp_id', 'event_id'],
    });

    pgm.addConstraint('payment_attempts', 'unique_payment_attempt_number', {
        unique: ['payment_id', 'attempt_number'],
    });
};

export const down = (pgm) => {
    pgm.dropTable('webhook_events');
    pgm.dropTable('idempotency_keys');
    pgm.dropTable('payment_attempts');
    pgm.dropTable('payments');
    pgm.dropTable('psps');
    pgm.dropTable('merchants');

    pgm.dropExtension('pgcrypto');
};
