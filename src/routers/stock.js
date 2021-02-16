const express = require('express')
const Stock = require('../models/stock')
const router = new express.Router()

// Get stock by quote
router.get('/stocks/:quote', async (req, res) => {
    const quote = req.params.quote
    try {
        const stock = await Stock.findOne({
            quote
        })
        if (!stock) return res.status(404).send({
            error: 'Stock is not found!'
        })
        res.send('Stock: ' + quote)
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

module.exports = router