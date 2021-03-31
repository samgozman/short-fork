const timeout = require('../utils/timeout')
const finvizor = require('finvizor')

const getFinvizData = async (ticker = '') => {
    const fin =  await timeout(finvizor.stock(ticker))

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
        finviz_short_flow: fin.shortFloat,
        target_price: fin.targetPrice,
        rsi: fin.rsi,
        recomendation: fin.recom ? fin.recom.toFixed(1) : null,
        site: fin.site,
    }
}

module.exports = getFinvizData