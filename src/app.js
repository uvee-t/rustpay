import pinoHttp from 'pino-http';
import express from 'express';
import { logger } from './utils/logger.js';
import { requestId } from './middleware/request-id.middleware.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';
import { asyncHandler } from './utils/asyncHandler.js';
import { AppError } from './utils/errors.js';
import helmet from 'helmet';
import cors from 'cors';

const app = express();
app.use(helmet());
app.use(cors());

app.use(requestId);
app.use(
    pinoHttp({
        logger,
        genReqId: (req) => req.id,
    }),
);

app.use(express.json({ limit: '4kb' }));
app.use(express.urlencoded({ extended: true, limit: '4kb' }));

app.use(notFound);
app.use(errorHandler);

export { app };
