const express = require('express')
const path = require('path')
const router = new express.Router()
const public_dir = path.join(__dirname, '../../public')

// Setup static directory to serve
router.use(express.static(public_dir))

// Array of object of main financial tags for Handlebars.
// Divided into 2 parts for 2 separated columns
const tags = require('./web-tags.json')

// root index page
router.get('', (req, res) => {
    res.render('index', {
        layout: 'bulma-ui',
        package_version: process.env.npm_package_version,
        financialTagsLeft: tags.financial.left,
        financialTagsRight: tags.financial.right,
        optionTagsLeft: tags.option.left,
        optionTagsRight: tags.option.right,
        TTL_NAKEDSHORT: (process.env.TTL_NAKEDSHORT / (1000 * 60)).toFixed(0),
        TTL_FINVIZ: (process.env.TTL_FINVIZ / (1000 * 60)).toFixed(0),
        TTL_SHORTSQUEEZE: (process.env.TTL_SHORTSQUEEZE / (1000 * 60)).toFixed(0),
        TTL_BARCHART_OVERVIEW: (process.env.TTL_BARCHART_OVERVIEW / (1000 * 60)).toFixed(0),
        TTL_BARCHART_FINANCIAL: (process.env.TTL_BARCHART_FINANCIAL / (1000 * 60 * 60 * 24)).toFixed(0)
    })
})

module.exports = router