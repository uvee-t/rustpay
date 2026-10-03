import { postgresPool } from '../config/database.js';
import { TABLES } from '../constants/tables.js';

const findIdempotencyKey = async ({ merchantId, idempotencyKey }) => {
    const query = `
        SELECT
            id,
            merchant_id,
            idempotency_key,
            request_hash,
            payment_id,
            status,
            response_status,
            response_body,
            created_at,
            expires_at
        FROM ${TABLES.IDEMPOTENCY_KEYS}
        WHERE
            merchant_id = $1
        AND
            idempotency_key = $2
        LIMIT 1
    `;

    const values = [merchantId, idempotencyKey];

    const result = await postgresPool.query(query, values);

    return result.rows[0] ?? null;
};

const createIdempotencyKey = async ({ merchantId, idempotencyKey, requestHash }) => {
    const query = `
        INSERT INTO ${TABLES.IDEMPOTENCY_KEYS}
        (
            merchant_id,
            idempotency_key,
            request_hash,
            status
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4
        )
        RETURNING
            id,
            merchant_id,
            idempotency_key,
            request_hash,
            payment_id,
            status,
            response_status,
            response_body,
            created_at,
            expires_at
    `;

    const values = [merchantId, idempotencyKey, requestHash, 'processing'];

    const result = await postgresPool.query(query, values);

    return result.rows[0];
};

const completeIdempotencyKey = async ({ id, paymentId, responseStatus, responseBody }) => {
    const query = `
        UPDATE ${TABLES.IDEMPOTENCY_KEYS}
        SET
            status = $5,
            payment_id = $2,
            response_status = $3,
            response_body = $4
        WHERE
            id = $1
        RETURNING
            id,
            merchant_id,
            idempotency_key,
            request_hash,
            payment_id,
            status,
            response_status,
            response_body,
            created_at,
            expires_at
    `;

    const values = [id, paymentId, responseStatus, responseBody, 'completed'];

    const result = await postgresPool.query(query, values);

    return result.rows[0];
};

export { findIdempotencyKey, createIdempotencyKey, completeIdempotencyKey };
