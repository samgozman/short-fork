const pTimeout = require('p-timeout')
const shortsqueeze = require('shortsqueeze')

// Return error if response timeout
const timeout = async (func = Promise, time = 5000) => {
    try {
        return await pTimeout(func, time)
    } catch (error) {
        return {
            error: 'Shortsqueeze не отвечает'
        }
    }
}

const getSqueeze = async (ticker = '') => {
    const squeeze = await timeout(shortsqueeze(ticker))

    return {
        squeeze_short_flow: squeeze ? squeeze.shortPercentOfFloat : null,
    }
}

module.exports = getSqueeze