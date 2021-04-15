import { Router } from 'express'
import { BarchartOverview } from '../models/barchartOverview.mjs'
import { BarchartFinancials } from '../models/barchartFinancials.mjs'
import { rateLimiter } from '../middleware/rateLimiter.mjs'
import { findStock } from '../middleware/findStock.mjs'
import { counter } from '../middleware/counter.mjs'

const router = new Router()

router.get('/stocks/barchart/overview', rateLimiter, findStock, counter, async (req, res) => {
    const ticker = req.query.ticker

    try {
        const data = await BarchartOverview.findByStockId(ticker, res.stock._id)
        return res.send(data)

    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.get('/stocks/barchart/financials', rateLimiter, findStock, counter, async (req, res) => {
    const ticker = req.query.ticker

    try {
        const data = await BarchartFinancials.findByStockId(ticker, res.stock._id)
        return res.send(data)

    } catch (err) {
        res.status(500).send(err.message)
    }
})

export default router