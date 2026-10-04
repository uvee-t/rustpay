import { AppError } from '../utils/errors.js';
import { createPaymentService } from '../services/payment.service.js';
import { beginIdempotency } from '../services/idempotency.service.js';
import { IDEMPOTENCY_STATUS } from '../constants/payment.js';
import { completeIdempotencyKey } from '../repositories/idempotency.repository.js';
const createPaymentController = async (req, res) => {
    const merchantId = req.headers['x-merchant-id'];
    const idempotencyKey = req.headers['idempotency-key'];

    if (!merchantId) {
        throw new AppError('x-merchant-id header is required', 400, 'MERCHANT_ID_REQUIRED');
    }

    if (!idempotencyKey) {
        throw new AppError('Idempotency-Key header is required', 400, 'IDEMPOTENCY_KEY_REQUIRED');
    }

    const { amount, currency, payment_method, description, metadata } = req.body;

    const paymentPayload = {
        amount,
        currency,
        payment_method,
        description,
        metadata,
    };

    const idempotency = await beginIdempotency({
        merchantId,
        idempotencyKey,
        payload: paymentPayload,
    });

    if (!idempotency.isNew) {
        const existing = idempotency.record;

        if (existing.status === IDEMPOTENCY_STATUS.COMPLETED) {
            return res.status(existing.response_status).json(existing.response_body);
        }

        throw new AppError(
            'A request with this Idempotency-Key is already being processed',
            409,
            'PAYMENT_REQUEST_IN_PROGRESS',
        );
    }

    const payment = await createPaymentService({
        merchantId,
        amount,
        currency,
        paymentMethod: payment_method,
        description,
        metadata,
    });

    const responseBody = {
        data: payment,
    };

    await completeIdempotencyKey({
        id: idempotency.record.id,
        paymentId: payment.id,
        responseStatus: 201,
        responseBody,
    });

    return res.status(200).json(responseBody);
};

export { createPaymentController };
