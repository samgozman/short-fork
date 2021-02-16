const express = require('express')
const path = require('path')
const router = new express.Router()

const public_dir = path.join(__dirname, '../public')

// Setup static directory to serve
router.use(express.static(public_dir))

// root index page
router.get('', (req, res) => {
    res.sendFile(path.join(public_dir, 'index.html'))
})

module.exports = router