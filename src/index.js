const express = require('express')
const path = require('path')
const getStockData = require('./utils/getstockdata')
const tinkoff = require('./utils/tinkoffstocks')
require('dotenv').config()
require('./db/mongoose')
const stockRouter = require('./routers/stock')

const app = express()
const port = process.env.PORT
const public_dir = path.join(__dirname, '../public')

// Setup static directory to serve
app.use(express.static(public_dir))

// Parse all incoming JSON to an object, so we can access it in the request (before passing routers)
app.use(express.json())

app.use(stockRouter)

// root index page
app.get('', (req, res) => {
    res.sendFile(path.join(public_dir, 'index.html'))
})

app.get('/request', async (req, res) => {
    if (!req.query.ticker) {
        return res.send({
            error: 'You must provide a ticker'
        })
    }
    try {
        const data = await getStockData(req.query.ticker.trim())
        res.send(data)
    } catch (error) {
        res.status(500).send()
    }

})

app.listen(port, async () => {
    //! Update tinkoff stock set
    // await tinkoff.update()
    console.log('Server is up on port ' + port)
})