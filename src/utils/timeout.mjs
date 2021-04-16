import pTimeout from 'p-timeout'

// Return error if response timeout
const timeout = async (func = Promise, time = 5000) => {
    try {
        return await pTimeout(func, time)
    } catch (error) {
        return {
            error: 'Провайдер данных не отвечает'
        }
    }
}

export default timeout