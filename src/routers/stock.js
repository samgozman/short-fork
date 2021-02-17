const express = require('express')
const Stock = require('../models/stock')
const getStockData = require('../utils/getstockdata')
const router = new express.Router()

// Get stock by quote
// if stock is not found - create one. Otherwise, check updatedAt. If it's older than N hours - update.
router.get('/stocks', async (req, res) => {
    const ticker = req.query.ticker

    // ! 1. Check if ticker is provided
    if (!ticker) {
        return res.status(400).send({
            error: 'You must provide a ticker'
        })
    }

    try {
        // ! 2. Find ticker in data base
        let stock = await Stock.findOne({
            ticker: ticker.toUpperCase()
        })

        // ! 3. Check if ticker is exist in DB and its "freshness"
        // 21600000 - 6h, 14400000 - 4h, 1200000 - 20m, 900000 - 15m, 30000 - 30s
        const keepFreshFor = 1200000
        if (stock && stock.price && (new Date() - stock.updatedAt) < keepFreshFor) {
            // ! 3.1 if stock is good - send it!
            return res.status(200).send(stock)
        } else if (stock) {
            // ! 3.2 If old stock is exist - update it and send it back
            const data = await getStockData(req.query.ticker.trim())
            if(!data) res.status(404).send()

            const updates = Object.keys(data)
            updates.forEach((update) => stock[update] = data[update])
            await stock.save()

            res.send(stock)
        } else {
            // ! 3.3 If stock is not exist - create it and send it back
            const data = await getStockData(req.query.ticker.trim())
            if(!data) return res.status(404).send()
            stock = new Stock({
                ticker,
                ...data
            })
            await stock.save()
            res.send(stock)
        }

    } catch (err) {
        res.status(500).send(err.message)
    }
})

module.exports = router