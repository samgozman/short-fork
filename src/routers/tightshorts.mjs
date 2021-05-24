import { Router } from 'express'
import { Tightshorts } from '../models/tightshorts.mjs'
import rateLimiter from '../middleware/rateLimiter.mjs'
import findStock from '../middleware/findStock.mjs'
import counter from '../middleware/counter.mjs'

const tightshortsRouter = new Router()

tightshortsRouter.get('/stocks/tightshorts', rateLimiter, findStock, counter, async (req, res) => {
    const ticker = req.query.ticker

    try {
        const data = await Tightshorts.findByStockId(ticker, res.stock._id)
        return res.send(data)

    } catch (err) {
        res.status(500).send(err.message)
    }
})

export default tightshortsRouter