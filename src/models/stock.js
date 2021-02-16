const mongoose = require('mongoose')

// Class schema for stock instance
const stockSchema = mongoose.Schema({
    quote: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    pe: {
        type: Number,
        default: null
    },
    ps: {
        type: Number,
        default: null
    },
    roe: {
        type: Number,
        default: null
    },
    roa: {
        type: Number,
        default: null
    },
    debteq: {
        type: Number,
        default: null
    },
    naked_current_short_volume: {
        type: Number,
        default: null
    },
    naked_history_short_volume: {
        type: Array,
        default: []
    },
    squeeze_short_flow: {
        type: Number,
        default: null
    },
    finviz_short_flow: {
        type: Number,
        default: null
    },
    tinkoff: {
        type: Boolean,
        default: false
    },
    target_price: {
        type: Number,
        default: null
    },
    rsi: {
        type: Number,
        default: null
    },
    recomendation: {
        type: Number,
        default: null
    },
    site: {
        type: Number,
        default: null
    },

}, {
    timestamps: true
})
const Stock = mongoose.model('Stock', stockSchema)

module.exports = Stock