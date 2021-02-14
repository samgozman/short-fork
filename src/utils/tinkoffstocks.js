const quotes = require('is-on-tinkoff-invest')
const fs = require('fs')

let tickers = []

/**
 * Update / create tinkoff stocks Set and store it
 * @async
 */
const update = async () => {
    const stocks = await quotes.getTinkoffStocks()
    stocks.forEach(stock => {
        tickers.push(stock.quote)
    })
}

/**
 * Check if you can buy this share in Tinkoff broker
 *
 * @param {string} ticker Stock ticker
 * @return {boolean}
 */
const isTinkoff = (ticker = '') => {
    return tickers.includes(ticker.toUpperCase())
}

module.exports = {
    update,
    isTinkoff
}