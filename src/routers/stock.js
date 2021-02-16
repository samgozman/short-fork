const express = require('express')
const Stock = require('../models/stock')
const getStockData = require('../utils/getstockdata')
const router = new express.Router()

// Get stock by quote
router.get('/stocks', async (req, res) => {
    const ticker = req.query.ticker
    try {
        const stock = await Stock.findOne({
            ticker
        })
        if (!stock) return res.status(404).send({
            error: 'Stock is not found!'
        })
        res.send(stock)
    } catch (err) {
        res.status(500).send()
    }
})

router.post('/stocks', async (req, res) => {
    const stock = new Stock({
        ...req.body
    })
    try {
        await stock.save()
        res.status(201).send(stock)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get('/request', async (req, res) => {
    if (!req.query.ticker) {
        return res.send({
            error: 'You must provide a ticker'
        })
    }
    try {
        const data = await getStockData(req.query.ticker.trim())
        res.send(data)
    } catch (error) {
        res.status(500).send()
    }

})

module.exports = router