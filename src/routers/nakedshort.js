const express = require('express')
const Naked = require('../models/nakedshort')
const getNaked = require('../utils/getnaked.js')
const stocksLimiter = require('../middleware/rateLimiter')
const findStock = require('../middleware/findStock')
const counter = require('../middleware/counter')
const router = new express.Router()

router.get('/stocks/nakedshort', stocksLimiter, findStock, counter, async (req, res) => {
    const ticker = req.query.ticker

    try {
        const data = await getNaked(ticker),
            naked = new Naked({
                _stock_id: res.stock._id,
                ...data
            })

        await naked.save()
        return res.send(naked)

    } catch (err) {
        res.status(500).send(err.message)
    }
})

module.exports = router