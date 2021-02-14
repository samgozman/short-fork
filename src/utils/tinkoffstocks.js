const quotes = require('is-on-tinkoff-invest')
const fs = require('fs')
const filePath = __dirname + '/tinkoff-tickers.json'

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

    const data = JSON.stringify(tickers)
    fs.writeFileSync(filePath, data)
}

/**
 * Check if you can buy this share in Tinkoff broker
 *
 * @param {string} ticker Stock ticker
 * @return {boolean}
 */
const isTinkoff = (ticker = '') => {
    const data = JSON.parse(fs.readFileSync(filePath)) || [],
        dataSet = new Set(data)

    return dataSet.has(ticker)
}

module.exports = {
    update,
    isTinkoff
}