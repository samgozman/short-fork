const express = require('express')
const path = require('path')
const router = new express.Router()
const public_dir = path.join(__dirname, '../../public')

// Setup static directory to serve
router.use(express.static(public_dir))

// Array of object of main financial tags for Handlebars.
// Divided into 2 parts for 2 separated columns
const financialTagsLeft = [{
        name: 'Price',
        id: 'resp_price'
    },
    {
        name: 'P/E',
        id: 'resp_pe'
    },
    {
        name: 'P/S',
        id: 'resp_ps'
    },
    {
        name: 'P/B',
        id: 'resp_pb'
    },
    {
        name: 'ROE',
        id: 'resp_roe'
    },
    {
        name: 'ROA',
        id: 'resp_roa'
    },
    {
        name: 'Debt/Eq',
        id: 'resp_debteq'
    }
]

const financialTagsRight = [{
        name: 'Naked SV',
        id: 'resp_naked'
    },
    {
        name: 'Squeeze SF',
        id: 'resp_squeeze'
    },
    {
        name: 'Finviz SF',
        id: 'resp_finviz'
    },
    {
        name: 'Tink',
        id: 'resp_tinkoff'
    },
    {
        name: 'Target',
        id: 'resp_finviz_target'
    },
    {
        name: 'RSI (14)',
        id: 'resp_finviz_rsi'
    },
    {
        name: 'Recom',
        id: 'resp_finviz_recom'
    }
]

// root index page
router.get('', (req, res, next) => {
    res.render('index', {
        layout: 'bulma-ui',
        package_version: process.env.npm_package_version,
        financialTagsLeft,
        financialTagsRight
    })
})

module.exports = router