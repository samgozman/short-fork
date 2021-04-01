const express = require('express')
const rateLimiter = require('../middleware/rateLimiter')
const findStock = require('../middleware/findStock')
const counter = require('../middleware/counter')
const router = new express.Router()

// Get stock by quote
router.get('/stocks', rateLimiter, findStock, counter,  async (req, res) => {
    try {
        // Aggregate virtuals into one object
        await res.stock.populate(['finviz', 'nakedshort', 'shortsqueeze']).execPopulate()

        res.send(res.stock.toJSON({
            virtuals: true
        }))
    } catch (err) {
        res.status(500).send(err.message)
    }
})

module.exports = router