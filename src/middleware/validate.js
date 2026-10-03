import { z } from 'zod';
import { AppError } from '../utils/errors.js';
const validate = (schema) => (req, res, next) => {
    const validationTarget = {};
    if (req.body) validationTarget.body = req.body;
    if (req.params) validationTarget.params = req.params;
    if (req.query) validationTarget.query = req.query;
    const result = z.object(schema).safeParse(validationTarget);

    if (!result.success) {
        const details = result.error.issues.map((issue) => issue.message);

        return next(new AppError(details, 400, 'VALIDATION_ERROR'));
    }

    const value = result.data;

    if (value.body) req.body = value.body;
    if (value.params) req.params = value.params;
    if (value.query) req.query = value.query;
    next();
};

export { validate };
