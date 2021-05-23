import app from './app.mjs'
import gettinkoff from './utils/gettinkoff.mjs'

// Use server-provided port or use dev 3000 if not
const port = process.env.PORT

app.listen(port, async () => {
    // const tinkError = await gettinkoff()
    // if(tinkError) {
    //     console.log('Error while updating Tinkoff indicator')
    // }
    console.log('Server is up on port ' + port)
})