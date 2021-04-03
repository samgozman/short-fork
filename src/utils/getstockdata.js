const timeout = require('../utils/timeout')
const shortsqueeze = require('shortsqueeze')
const nakedshort = require('nakedshort')
const finvizor = require('finvizor')

const getStockData = async (ticker = '') => {
    const
        squeeze = await timeout(shortsqueeze(ticker)),
        naked_chart = await timeout(nakedshort.getChart(ticker)),
        fin = await finvizor.stock(ticker)

    let
        naked_length = undefined,
        naked_current_short_volume = undefined

    if (naked_chart && !naked_chart.error) {
        naked_length = naked_chart.regularVolArr.length,
            naked_current_short_volume = (naked_chart.shortVolArr[naked_length - 1] / naked_chart.regularVolArr[naked_length - 1]) * 100
    }

    if (fin.error) {
        console.log(fin.error)
        return undefined
    }

    return {
        name: fin.name,
        price: fin.price,
        pe: fin.pe,
        ps: fin.ps,
        pb: fin.pb,
        roe: fin.roe,
        roa: fin.roa,
        debteq: fin.debtEq,
        naked_current_short_volume: naked_current_short_volume ? naked_current_short_volume.toFixed(2) : null,
        squeeze_short_flow: squeeze ? squeeze.shortPercentOfFloat : null,
        finviz_short_flow: fin.shortFloat,
        target_price: fin.targetPrice,
        rsi: fin.rsi,
        recomendation: fin.recom ? fin.recom.toFixed(1) : null,
        site: fin.site,
        naked_chart: naked_chart || null
    }
}

module.exports = getStockData