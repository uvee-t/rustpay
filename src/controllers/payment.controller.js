import { AppError } from '../utils/errors.js';
import { createPaymentService } from '../services/payment.service.js';
const createPaymentController = async (req, res) => {
    const merchantId = req.headers['x-merchant-id'];
    if (!merchantId) {
        throw new AppError('x-merchant-id header is required', 400, 'MERCHANT_ID_REQUIRED');
    }
    const { amount, currency, payment_method, description, metadata } = req.body;
    const payment = await createPaymentService({
        merchantId,
        amount,
        currency,
        paymentMethod: payment_method,
        description,
        metadata,
    });

    return res.status(200).json({
        data: payment,
    });
};

export { createPaymentController };
