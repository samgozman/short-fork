const express = require('express')
const Finviz = require('../models/finviz')
const getFinvizData = require('../utils/getfinviz')
const stocksLimiter = require('../middleware/rateLimiter')
const findStock = require('../middleware/findStock')
const counter = require('../middleware/counter')
const router = new express.Router()

router.get('/stocks/finviz', stocksLimiter, findStock, counter, async (req, res) => {
    const ticker = req.query.ticker

    try {
        const data = await getFinvizData(ticker),
            fin = new Finviz({
                _stock_id: res.stock._id,
                ...data
            })

        await fin.save()
        return res.send(fin)

    } catch (err) {
        res.status(500).send(err.message)
    }
})

module.exports = router