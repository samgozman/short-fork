import { Stock } from '../models/stock.mjs'
import  { Finviz } from '../models/finviz.mjs'

const findStock = async (req, res, next) => {
    let ticker = req.query.ticker

    // ! 1. Check if ticker is provided
    if (!ticker) {
        return res.status(400).send({
            error: 'You must provide a ticker'
        })
    }
    try {
        ticker = ticker.toUpperCase()

        // Replace every non-word except dot
        ticker = ticker.replace(/[^\w.]/g,'')

        // ! 2. Find ticker in data base
        let stock = await Stock.findOne({
            ticker
        })

        // ! 3. If stock is not found - search in Finviz and create
        if (!stock) {
            const finviz = await Finviz.getFromSource(ticker)

            // If finviz is not erorr - create stock record and finviz
            if (finviz && !finviz.error) {
                stock = new Stock({
                    ticker
                })
                await stock.save()

                // Store parsed finviz data
                await Finviz.createRecord(ticker, stock._id, {
                    ...finviz
                })

            } else {
                throw new Error()
            }
        }

        res.stock = stock
        next()
    } catch (error) {
        return res.status(404).send({
            error: 'Stock is not found!'
        })
    }
}

export default findStock