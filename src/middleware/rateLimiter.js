const rateLimit = require('express-rate-limit')

// limit requests
const stocksLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 20
})

module.exports = stocksLimiter