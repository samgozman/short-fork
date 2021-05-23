import { Router } from 'express'
import rateLimiter from '../middleware/rateLimiter.mjs'
import findStock from '../middleware/findStock.mjs'
import counter from '../middleware/counter.mjs'

const stockRouter = new Router()

// Get stock by quote
stockRouter.get('/stocks', rateLimiter, findStock, counter, async (req, res) => {
    try {
        // Aggregate virtuals into one object
        await res.stock.populate(['finviz', 'tightshorts', 'shortsqueeze', 'barchartoverview', 'barchartfinancials']).execPopulate()
        const stock = res.stock.toJSON({
            virtuals: true
        })

        // Delete unnecessary data.
        // Because of the virtuals we can't use classic toJSON tweak here
        delete stock._stock_id
        delete stock._id
        delete stock.id
        delete stock.__v
        delete stock._counter
        delete stock.createdAt
        delete stock.updatedAt

        // Add Short-Fork version number
        stock.version = process.env.npm_package_version
        
        res.send(stock)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

export default stockRouter