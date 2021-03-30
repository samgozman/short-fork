const mongoose = require('mongoose')

// Class schema for stock instance
const stockSchema = mongoose.Schema({
    ticker: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    tinkoff: {
        type: Boolean,
        default: false
    },
    _counter: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

stockSchema.virtual('finviz', {
    ref: 'Finviz',
    localField: '_id',
    foreignField: '_stock_id'
})

const Stock = mongoose.model('Stock', stockSchema)

module.exports = Stock