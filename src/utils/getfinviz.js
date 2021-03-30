const pTimeout = require('p-timeout')
const finvizor = require('finvizor')

// Return error if response timeout
const timeout = async (func = Promise, time = 5000) => {
    try {
        return await pTimeout(func, time)
    } catch (error) {
        return {
            error: 'Finviz не отвечает'
        }
    }
}

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