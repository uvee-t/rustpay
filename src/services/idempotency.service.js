import {
    findIdempotencyKey,
    createIdempotencyKey,
} from '../repositories/idempotency.repository.js';
import { createRequestHash } from '../utils/hash.js';
import { AppError } from '../utils/errors.js';

const beginIdempotency = async ({ merchantId, idempotencyKey, payload }) => {
    const requestHash = createRequestHash(payload);

    const existing = await findIdempotencyKey({ merchantId, idempotencyKey });

    if (existing) {
        if (existing.request_hash !== requestHash) {
            throw new AppError(
                'Idempotency key was already used with a different request',
                409,
                'IDEMPOTENCY_KEY_REUSED',
            );
        }
        return {
            isNew: false,
            record: existing,
        };
    }

    try {
        const record = await createIdempotencyKey({
            merchantId,
            idempotencyKey,
            requestHash,
        });

        return {
            isNew: true,
            record,
        };
    } catch (error) {
        if (error.code === '23505') {
            const existingRecord = await findIdempotencyKey({
                merchantId,
                idempotencyKey,
            });

            if (!existingRecord) {
                throw error;
            }

            if (existingRecord.request_hash !== requestHash) {
                throw new AppError(
                    'Idempotency key was already used with a different request',
                    409,
                    'IDEMPOTENCY_KEY_REUSED',
                );
            }

            return {
                isNew: false,
                record: existingRecord,
            };
        }

        throw error;
    }
};

export { beginIdempotency };
