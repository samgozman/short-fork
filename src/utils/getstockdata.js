const shortsqueeze = require('shortsqueeze')
const nakedshort = require('nakedshort')
const finvizor = require('finvizor')

const getStockData = async (ticker = '') => {
    const squeeze = await shortsqueeze(ticker),
        naked = await nakedshort(ticker),
        fin = await finvizor.stock(ticker)
        //! targetUpside = (fin.targetPrice != null && fin.price != null) ? ((fin.targetPrice / fin.price - 1) * 100).toFixed(1) : null
    return {
        name: fin.name,
        price: fin.price,
        pe: fin.pe,
        ps: fin.ps,
        roe: fin.roe,
        roa: fin.roa,
        debteq: fin.debtEq,
        naked_current_short_volume: naked.nakedShortPercent,
        naked_history_short_volume: naked.historicalShortVol,
        squeeze_short_flow: squeeze.shortPercentOfFloat,
        finviz_short_flow: fin.shortFloat,
        target_price: fin.targetPrice, //targetUpside
        rsi: fin.rsi,
        recomendation: fin.recom.toFixed(1),
        site: fin.site
    }
}

module.exports = getStockData