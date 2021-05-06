import { Router } from 'express'
import { Finviz } from '../models/finviz.mjs'
import rateLimiter from '../middleware/rateLimiter.mjs'
import findStock from '../middleware/findStock.mjs'
import counter from '../middleware/counter.mjs'

const finvizRouter = new Router()

finvizRouter.get('/stocks/finviz', rateLimiter, findStock, counter, async (req, res) => {
    const ticker = req.query.ticker

    try {
        const data = await Finviz.findByStockId(ticker, res.stock._id)
        return res.send(data)

    } catch (err) {
        res.status(500).send(err.message)
    }
})

export default finvizRouter