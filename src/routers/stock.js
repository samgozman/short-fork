const express = require('express')
const Stock = require('../models/stock')
const getStockData = require('../utils/getstockdata')
const tinkoff = require('is-on-tinkoff-invest')
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
            ticker
        })

        // ! 3. Check if ticker is exist in DB and its "freshness"
        // 21600000 - 6h, 14400000 - 4h, 30000 - 30s
        const keepFreshFor = 30000
        if (stock && (new Date() - stock.updatedAt) < keepFreshFor) {
            // ! 3.1 if stock is good - send it!
            return res.status(200).send(stock)
        } else if (stock) {
            // ! 3.2 If old stock is exist - update it and send it back
            const data = await getStockData(req.query.ticker.trim())
            const updates = Object.keys(data)

            updates.forEach((update) => stock[update] = data[update])
            await stock.save()

            res.send(stock)
        } else {
            // ! 3.3 If stock is not exist - create it and send it back
            const data = await getStockData(req.query.ticker.trim())
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

// ! DEV ROUTE
// Update tinkoff indicator
router.patch('/tinkoff/update', async (req, res) => {
    if(req.query.token !== process.env.SECRET_KEY) {
        return res.status(401).send()
    }

    try {
        const tinkoffStocks = await tinkoff.getTinkoffStocks()
        // ! Save tinkoff status to DB. If stock is not there - create it.
        for (const item of tinkoffStocks) {
            // Try to find existing
            let stock = await Stock.findOne({
                ticker: item.quote
            })

            if(stock) {
                stock.tinkoff = true
            } else {
                stock = new Stock({
                    ticker: item.quote,
                    name: item.name,
                    tinkoff: true
                })
            }
            await stock.save()
        }
        res.status(200).send('Tinkoff indicator updated! ' + tinkoffStocks.length)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = router