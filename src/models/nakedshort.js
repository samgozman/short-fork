const mongoose = require('mongoose')

// Class schema for Nakedshort instance
const nakedshortSchema = mongoose.Schema({
    _stock_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Stock'
    },
    naked_current_short_volume: {
        type: Number,
        default: null
    },
    naked_chart: {
        type: Array,
        default: []
    },
}, {
    timestamps: true
})
const Nakedshort = mongoose.model('Nakedshort', nakedshortSchema)

module.exports = Nakedshort