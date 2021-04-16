import express from 'express'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const router = new express.Router()

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const public_dir = join(__dirname, '../../public')

// Setup static directory to serve
router.use(express.static(public_dir))

// Array of object of main financial tags for Handlebars.
// Divided into 2 parts for 2 separated columns
const { financial, option } = require('./web-tags.json')

// root index page
router.get('', (req, res) => {
    res.render('index', {
        layout: 'bulma-ui',
        package_version: process.env.npm_package_version,
        financialTagsLeft: financial.left,
        financialTagsRight: financial.right,
        optionTagsLeft: option.left,
        optionTagsRight: option.right,
        TTL_NAKEDSHORT: (process.env.TTL_NAKEDSHORT / (1000 * 60)).toFixed(0),
        TTL_FINVIZ: (process.env.TTL_FINVIZ / (1000 * 60)).toFixed(0),
        TTL_SHORTSQUEEZE: (process.env.TTL_SHORTSQUEEZE / (1000 * 60)).toFixed(0),
        TTL_BARCHART_OVERVIEW: (process.env.TTL_BARCHART_OVERVIEW / (1000 * 60)).toFixed(0),
        TTL_BARCHART_FINANCIAL: (process.env.TTL_BARCHART_FINANCIAL / (1000 * 60 * 60 * 24)).toFixed(0)
    })
})

export default router