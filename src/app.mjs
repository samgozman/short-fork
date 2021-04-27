import express from 'express'
import { fileURLToPath } from 'url'
import { create } from 'express-handlebars'
import compression from 'compression'

import './db/connection.mjs'
import stockRouter from './routers/stock.mjs'
import finvizRouter from './routers/finviz.mjs'
import nakedRouter from './routers/nakedshort.mjs'
import squeezeRouter from './routers/shortsqueeze.mjs'
import barchartRouter from './routers/barchart.mjs'
import webRouter from './routers/web.mjs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const app = express()
const hbs = create({
    extname: 'hbs',
    partialsDir: __dirname + '/../views/partials'
})

// https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1)

// Register `hbs.engine` with the Express app.
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

// gZip compression
app.use(compression())

// Parse all incoming JSON to an object, so we can access it in the request (before passing routers)
app.use(express.json())

app.use(finvizRouter)
app.use(nakedRouter)
app.use(squeezeRouter)
app.use(stockRouter)
app.use(barchartRouter)
app.use(webRouter)

export default app