const PAYMENT_STATUS = Object.freeze({
    CREATED: 'created',
    PROCESSING: 'processing',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
    UNKNOWN: 'unknown',
});

const PAYMENT_METHOD = Object.freeze({
    CARD: 'card',
    UPI: 'upi',
    NET_BANKING: 'net_banking',
    WALLET: 'wallet',
});

const IDEMPOTENCY_STATUS = Object.freeze({
    PROCESSING: 'processing',
    COMPLETED: 'completed',
});

export { PAYMENT_STATUS, PAYMENT_METHOD, IDEMPOTENCY_STATUS };
