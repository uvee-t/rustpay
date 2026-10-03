import { createPayment } from '../repositories/payment.repository.js';
const createPaymentService = async ({
    merchantId,
    amount,
    currency,
    paymentMethod,
    description,
    metadata,
}) => {
    const payment = await createPayment({
        merchantId,
        amount,
        currency,
        paymentMethod,
        description,
        metadata,
    });
    return payment;
};

export { createPaymentService };
