const express = require('express')
const Shortsqueeze = require('../models/shortsqueeze')
const getShortsqueeze = require('../utils/getshortsqueeze')
const stocksLimiter = require('../middleware/rateLimiter')
const findStock = require('../middleware/findStock')
const counter = require('../middleware/counter')
const router = new express.Router()

router.get('/stocks/shortsqueeze', stocksLimiter, findStock, counter, async (req, res) => {
    const ticker = req.query.ticker

    try {
        const data = await getShortsqueeze(ticker),
            squeeze = new Shortsqueeze({
                _stock_id: res.stock._id,
                ...data
            })

        await squeeze.save()
        return res.send(squeeze)

    } catch (err) {
        res.status(500).send(err.message)
    }
})

module.exports = router