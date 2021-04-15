import { Router } from 'express'
import { Nakedshort } from '../models/nakedshort.mjs'
import { rateLimiter } from '../middleware/rateLimiter.mjs'
import { findStock } from '../middleware/findStock.mjs'
import { counter } from '../middleware/counter.mjs'

export const router = new Router()

router.get('/stocks/nakedshort', rateLimiter, findStock, counter, async (req, res) => {
    const ticker = req.query.ticker

    try {
        const data = await Nakedshort.findByStockId(ticker, res.stock._id)
        return res.send(data)

    } catch (err) {
        res.status(500).send(err.message)
    }
})

export default router