import crypto from 'node:crypto';
const createRequestHash = (payload) => {
    const normalizedPayload = JSON.stringify(payload);
    return crypto.createHash('sha256').update(normalizedPayload).digest('hex');
};

export { createRequestHash };
