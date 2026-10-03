import { z } from 'zod';
import { PAYMENT_METHOD } from '../constants/payment.js';

const createPaymentSchema = {
    body: z.object({
        amount: z.number().int().positive(),

        currency: z.string().length(3).toUpperCase(),

        payment_method: z.enum(Object.values(PAYMENT_METHOD)),

        description: z.string().max(500).optional().default(''),

        metadata: z.record(z.string(), z.unknown()).default({}),
    }),
};

export { createPaymentSchema };
