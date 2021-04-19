import pTimeout from 'p-timeout'

/**
 * Return error if response timeout
 * @param {Promise} func Promise
 * @param {Number} [time] Time in milliseconds to wait for promise resolve
 * @return {Object} Fetched data or error
 */
const timeout = async (func, time = 5000) => {
    try {
        return await pTimeout(func, time)
    } catch (error) {
        return {
            error: 'Провайдер данных не отвечает'
        }
    }
}

export default timeout