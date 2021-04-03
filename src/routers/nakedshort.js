const express = require('express')
const Naked = require('../models/nakedshort')
const rateLimiter = require('../middleware/rateLimiter')
const findStock = require('../middleware/findStock')
const counter = require('../middleware/counter')
const router = new express.Router()

router.get('/stocks/nakedshort', rateLimiter, findStock, counter, async (req, res) => {
    const ticker = req.query.ticker

    try {
        const data = await Naked.findByStockId(ticker, res.stock._id)
        return res.send(data)

    } catch (err) {
        res.status(500).send(err.message)
    }
})

module.exports = router