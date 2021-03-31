const mongoose = require('mongoose')

// Class schema for shortsqueeze instance
const shortsqueezeSchema = mongoose.Schema({
    _stock_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Stock'
    },
    squeeze_short_flow: {
        type: Number,
        default: null
    }
}, {
    timestamps: true
})
const Shortsqueeze = mongoose.model('Shortsqueeze', shortsqueezeSchema)

module.exports = Shortsqueeze