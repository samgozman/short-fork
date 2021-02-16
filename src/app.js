const express = require('express')
require('./db/mongoose')
const stockRouter = require('./routers/stock')
const webRouter = require('./routers/web')

const app = express()

// Parse all incoming JSON to an object, so we can access it in the request (before passing routers)
app.use(express.json())

app.use(stockRouter)
app.use(webRouter)

module.exports = app