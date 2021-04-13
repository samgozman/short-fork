const express = require('express')
const exphbs = require('express-handlebars')
require('./db/mongoose')

const stockRouter = require('./routers/stock')
const finvizRouter = require('./routers/finviz')
const nakedRouter = require('./routers/nakedshort')
const squeezeRouter = require('./routers/shortsqueeze')
const barchartRouter = require('./routers/barchart')
const webRouter = require('./routers/web')

const app = express()
const hbs = exphbs.create({
    extname: 'hbs',
    partialsDir: __dirname + '/../views/partials'
})

// https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1)

// Register `hbs.engine` with the Express app.
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

// Parse all incoming JSON to an object, so we can access it in the request (before passing routers)
app.use(express.json())

app.use(finvizRouter)
app.use(nakedRouter)
app.use(squeezeRouter)
app.use(stockRouter)
app.use(barchartRouter)
app.use(webRouter)

module.exports = app