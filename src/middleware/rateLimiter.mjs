import rateLimit from 'express-rate-limit'

// limit requests
export const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 20
})
