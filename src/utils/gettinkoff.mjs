import { Stock } from '../models/stock.mjs'
import { Tinkoff } from 'tinkoff-api-securities'

// Update tinkoff indicator
const gettinkoff = async () => {
        try {
        const API = new Tinkoff(process.env.SANDBOX_TOKEN)
        const tinkoffStocks = await API.stocks('USD')
        // Save tinkoff status to DB. If stock is not there - create it.
        for (const item of tinkoffStocks) {
            // Try to find existing
            let stock = await Stock.findOne({
                ticker: item.ticker
            })

            if(stock) {
                stock.tinkoff = true
            } else {
                stock = new Stock({
                    ticker: item.ticker,
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

export default gettinkoff