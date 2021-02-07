const express = require('express')
const path = require('path')
const getStockData = require('./utils/getstockdata')

const app = express()
const port = process.env.PORT || 3000
const public_dir = path.join(__dirname, '../public')

// Setup static directory to serve
app.use(express.static(public_dir))

// root index page
app.get('', (req, res) => {
    res.sendFile(path.join(public_dir, 'index.html'))
})

app.get('/request', async (req, res) => {
    if (!req.query.ticker) {
        return res.send({
            error: 'You must provide ticker'
        })
    }
    try {
        //! Fix ticker (spaces, symbols, etc)
        const data = await getStockData(req.query.ticker)
        res.send(data)
    } catch (error) {
         res.status(500).send()
    }
    
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})