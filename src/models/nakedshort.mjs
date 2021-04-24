import mongoose from 'mongoose'
import StockModule from '../db/StockModule.mjs'
import timeout from '../utils/timeout.mjs'
import nakedshort from 'nakedshort'

// Class mongoose.Schema for Nakedshort instance
const nakedshortSchema = mongoose.Schema({
    _stock_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Stock'
    },
    _ttl: {
        type: Number,
        default: 1200000,
        required: true
    },
    current_short_volume: {
        type: Number,
        default: null
    },
    chart: {
        type: Array,
        default: []
    },
}, {
    timestamps: true
})

/**
 * Get financial data from nakedshortreport
 * @async
 * @param {String} ticker Stocks ticker
 * @return {Object} debt, equity, revenue etc..
 */
nakedshortSchema.statics.getFromSource = async function (ticker) {
    try {
        const chart = await timeout(nakedshort.getChart(ticker))

        let
            naked_length = undefined,
            current_short_volume = undefined

        if (chart && !chart.error) {
            naked_length = chart.regularVolArr.length
            current_short_volume = (chart.shortVolArr[naked_length - 1] / chart.regularVolArr[naked_length - 1]) * 100
        }

        return {
            current_short_volume: current_short_volume ? current_short_volume.toFixed(2) : null,
            chart: chart.error ? null : chart,
            _ttl: process.env.TTL_NAKEDSHORT

        }
    } catch (error) {
        return {
            error: 'Nakedshort service is unavalible'
        }
    }
}

nakedshortSchema.loadClass(StockModule)
nakedshortSchema.pre('find', nakedshortSchema.methods.preFind)

export const Nakedshort = mongoose.model('Nakedshort', nakedshortSchema)