const express = require('express')
const Finviz = require('../models/finviz')
const stocksLimiter = require('../middleware/rateLimiter')
const findStock = require('../middleware/findStock')
const counter = require('../middleware/counter')
const router = new express.Router()

router.get('/stocks/finviz', stocksLimiter, findStock, counter, async (req, res) => {
    const ticker = req.query.ticker

    try {
        const data = await Finviz.findByStockId(ticker, res.stock._id)
        return res.send(data)

    } catch (err) {
        res.status(500).send(err.message)
    }
})

module.exports = router