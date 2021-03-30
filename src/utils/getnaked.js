const pTimeout = require('p-timeout')
const nakedshort = require('nakedshort')

// Return error if response timeout
const timeout = async (func = Promise, time = 5000) => {
    try {
        return await pTimeout(func, time)
    } catch (error) {
        return {
            error: 'Nakedshort  не отвечает'
        }
    }
}

const getNaked = async (ticker = '') => {
    const naked_chart = await timeout(nakedshort.getChart(ticker))

    let
        naked_length = undefined,
        naked_current_short_volume = undefined

    if (naked_chart && !naked_chart.error) {
        naked_length = naked_chart.regularVolArr.length,
            naked_current_short_volume = (naked_chart.shortVolArr[naked_length - 1] / naked_chart.regularVolArr[naked_length - 1]) * 100
    }

    return {
        naked_current_short_volume: naked_current_short_volume ? naked_current_short_volume.toFixed(2) : null,
        naked_chart: naked_chart || null
    }
}

module.exports = getNaked