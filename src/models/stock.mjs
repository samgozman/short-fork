import mongoose from 'mongoose'

// Class mongoose.Schema for stock instance
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
    foreignField: '_stock_id',
    justOne: true
})

stockSchema.virtual('nakedshort', {
    ref: 'Nakedshort',
    localField: '_id',
    foreignField: '_stock_id',
    justOne: true
})

stockSchema.virtual('shortsqueeze', {
    ref: 'Shortsqueeze',
    localField: '_id',
    foreignField: '_stock_id',
    justOne: true
})

stockSchema.virtual('barchartoverview', {
    ref: 'BarchartOverview',
    localField: '_id',
    foreignField: '_stock_id',
    justOne: true
})

stockSchema.virtual('barchartfinancials', {
    ref: 'BarchartFinancials',
    localField: '_id',
    foreignField: '_stock_id',
    justOne: true
})

export const Stock = mongoose.model('Stock', stockSchema)
