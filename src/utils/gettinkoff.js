const Stock = require('../models/stock')
const tinkoff = require('is-on-tinkoff-invest')

// Update tinkoff indicator
const update = async () => {
        try {
        const tinkoffStocks = await tinkoff.getTinkoffStocks()
        // Save tinkoff status to DB. If stock is not there - create it.
        for (const item of tinkoffStocks) {
            // Try to find existing
            let stock = await Stock.findOne({
                ticker: item.quote
            })

            if(stock) {
                stock.tinkoff = true
            } else {
                stock = new Stock({
                    ticker: item.quote,
                    name: item.name,
                    tinkoff: true
                })
            }
            await stock.save()
        }
    } catch (error) {
        return {error: error.message}
    }
}

module.exports = update