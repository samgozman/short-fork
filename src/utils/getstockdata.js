const shortsqueeze = require('shortsqueeze')
const nakedshort = require('nakedshort')
const finviz = require('@stonksjs/finviz')

const getStockData = async (ticker = '') => {
    const squeeze = await shortsqueeze(ticker)
    const naked = await nakedshort(ticker)
    const fin = await finviz.quote(ticker)

    return {
        resp_name: squeeze.name,
        resp_price: fin.price,
        resp_pe: fin.pE,
        resp_ps: fin.pS,
        resp_roe: fin.roe,
        resp_roa: fin.roa,
        resp_debteq: fin.debtEq,
        resp_naked: naked.nakedShortPercent,
        resp_squeeze: squeeze.shortPercentOfFloat,
        resp_finviz: fin.shortFloat
    }
}

module.exports = getStockData