const express = require('express')
const Stock = require('../models/stock')
const stocksLimiter = require('../middleware/rateLimiter')
const findStock = require('../middleware/findStock')
const router = new express.Router()

// Get stock by quote
// if stock is not found - create one. Otherwise, check updatedAt. If it's older than N hours - update.
router.get('/stocks', stocksLimiter, findStock, async (req, res) => {
    const ticker = req.query.ticker
    let stock = res.stock

    try {
        // ! Find all connect DB. If not found - create. If it's older than N hours - update
    } catch (err) {
        res.status(500).send(err.message)
    }
})

module.exports = router