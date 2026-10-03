import { postgresPool } from '../config/database.js';
import { TABLES } from '../constants/tables.js';
const createPayment = async ({
    merchantId,
    amount,
    currency,
    paymentMethod,
    description,
    metadata,
}) => {
    const query = `
        INSERT INTO ${TABLES.PAYMENTS}
        (
            merchant_id,
            amount,
            currency,
            payment_method,
            description,
            metadata
        )
        VALUES
        (
            $1, $2, $3, $4, $5, $6
        )
        RETURNING
            id,
            merchant_id,
            amount,
            currency,
            payment_method,
            status,
            description,
            metadata,
            created_at,
            updated_at
    `;
    const values = [merchantId, amount, currency, paymentMethod, description ?? null, metadata];
    const result = await postgresPool.query(query, values);
    return result.rows[0];
};

export { createPayment };
