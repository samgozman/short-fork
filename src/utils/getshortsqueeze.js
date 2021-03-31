const timeout = require('../utils/timeout')
const shortsqueeze = require('shortsqueeze')

const getSqueeze = async (ticker = '') => {
    const squeeze = await timeout(shortsqueeze(ticker))

    return {
        squeeze_short_flow: squeeze ? squeeze.shortPercentOfFloat : null,
    }
}

module.exports = getSqueeze