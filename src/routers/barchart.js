const express = require('express')
const BarchartOverview = require('../models/barchartOverview')
const rateLimiter = require('../middleware/rateLimiter')
const findStock = require('../middleware/findStock')
const counter = require('../middleware/counter')
const router = new express.Router()

router.get('/stocks/barchart/overview', rateLimiter, findStock, counter, async (req, res) => {
    const ticker = req.query.ticker

    try {
        const data = await BarchartOverview.findByStockId(ticker, res.stock._id)
        return res.send(data)

    } catch (err) {
        res.status(500).send(err.message)
    }
})

module.exports = router