const Stock = require('../models/stock')

const findStock = async (req, res, next) => {
    const ticker = req.query.ticker
    
    // ! 1. Check if ticker is provided
    if (!ticker) {
        return res.status(400).send({
            error: 'You must provide a ticker'
        })
    }
    try {
        // ! 2. Find ticker in data base
        let stock = await Stock.findOne({
            ticker: ticker.toUpperCase()
        })

        // stock._counter++
        // await stock.save()
        // store stock object
        res.stock = stock
        next()
    } catch (error) {
        res.status(401).send({
            error: 'Error in findStock.js'
        })
    }

}

module.exports = findStock