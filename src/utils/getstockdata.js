const shortsqueeze = require('shortsqueeze')
const nakedshort = require('nakedshort')
const finvizor = require('finvizor')
const tinkoff = require('./tinkoffstocks')

const getStockData = async (ticker = '') => {
    const squeeze = await shortsqueeze(ticker),
        naked = await nakedshort(ticker),
        fin = await finvizor.stock(ticker)

    return {
        resp_name: squeeze.name,
        resp_price: fin.price,
        resp_pe: fin.pe,
        resp_ps: fin.ps,
        resp_roe: fin.roe,
        resp_roa: fin.roa,
        resp_debteq: fin.debtEq,
        resp_naked: naked.nakedShortPercent,
        resp_squeeze: squeeze.shortPercentOfFloat,
        resp_finviz: fin.shortFloat,
        resp_tinkoff: tinkoff.isTinkoff(ticker)
    }
}

module.exports = getStockData