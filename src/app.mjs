import express, { json } from 'express'
import { fileURLToPath } from 'url'
import { create } from 'express-handlebars'

import './db/mongoose.mjs'
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

// Parse all incoming JSON to an object, so we can access it in the request (before passing routers)
app.use(json())

app.use(finvizRouter)
app.use(nakedRouter)
app.use(squeezeRouter)
app.use(stockRouter)
app.use(barchartRouter)
app.use(webRouter)

export default app