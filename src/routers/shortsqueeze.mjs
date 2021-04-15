import { Router } from 'express'
import { Shortsqueeze } from '../models/shortsqueeze.mjs'
import rateLimiter from '../middleware/rateLimiter.mjs'
import findStock from '../middleware/findStock.mjs'
import counter from '../middleware/counter.mjs'

const router = new Router()

router.get('/stocks/shortsqueeze', rateLimiter, findStock, counter, async (req, res) => {
    const ticker = req.query.ticker

    try {
        const data = await Shortsqueeze.findByStockId(ticker, res.stock._id)
        return res.send(data)

    } catch (err) {
        res.status(500).send(err.message)
    }
})

export default router