const shortsqueeze = require('shortsqueeze')
const nakedshort = require('nakedshort')
const finvizor = require('finvizor')

const getStockData = async (ticker = '') => {
    const squeeze = await shortsqueeze(ticker),
        naked_chart = await nakedshort.getChart(ticker),
        fin = await finvizor.stock(ticker),
        naked_length = naked_chart.regularVolArr.length,
        naked_current_short_volume = (naked_chart.shortVolArr[naked_length-1] / naked_chart.regularVolArr[naked_length-1]) * 100

    if (fin.error) return undefined
    return {
        name: fin.name,
        price: fin.price,
        pe: fin.pe,
        ps: fin.ps,
        pb: fin.pb,
        roe: fin.roe,
        roa: fin.roa,
        debteq: fin.debtEq,
        naked_current_short_volume: naked_current_short_volume.toFixed(2) || null,
        squeeze_short_flow: squeeze.shortPercentOfFloat,
        finviz_short_flow: fin.shortFloat,
        target_price: fin.targetPrice,
        rsi: fin.rsi,
        recomendation: fin.recom ? fin.recom.toFixed(1) : null,
        site: fin.site,
        naked_chart
    }
}

module.exports = getStockData