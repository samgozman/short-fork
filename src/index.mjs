import app from './app.mjs'
import gettinkoff from './utils/gettinkoff.mjs'
import {
    scheduleJob
} from 'node-schedule'

const port = process.env.PORT

app.listen(port, async () => {
    // Get all Tinkoff stocks at start
    const tinkError = await gettinkoff()
    if (tinkError) {
        console.log('Error while updating Tinkoff indicator:', tinkError)
    }

    // Schedule Tinkoff stocks auto updater
    scheduleJob({
        minute: 10,
        hour: 10,
        tz: 'Europe/Moscow'
    }, async function () {
        await gettinkoff()
    })

    console.log('Server is up on port ' + port)
})