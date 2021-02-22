const express = require('express')
const path = require('path')
const router = new express.Router()
const public_dir = path.join(__dirname, '../../public')

// Setup static directory to serve
router.use(express.static(public_dir))

// root index page
router.get('', (req, res, next) => {
    res.render('index', {
        layout: 'bulma-ui',
        package_version: process.env.npm_package_version
    })
})

module.exports = router