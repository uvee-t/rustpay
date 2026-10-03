import express from 'express';
import { createPaymentController } from '../controllers/payment.controller.js';
import { validate } from '../middleware/validate.js';
import { createPaymentSchema } from '../validators/payment.validator.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.post('/', validate(createPaymentSchema), asyncHandler(createPaymentController));

export default router;
