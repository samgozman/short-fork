import mongoose from 'mongoose'
import {
    Stock
} from './stock.mjs'
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
            naked_length = chart.regularVolArr.length,
                current_short_volume = (chart.shortVolArr[naked_length - 1] / chart.regularVolArr[naked_length - 1]) * 100
        }

        return {
            current_short_volume: current_short_volume ? current_short_volume.toFixed(2) : null,
            chart: chart.error ? null : chart

        }
    } catch (error) {
        return {
            error: 'Nakedshort service is unavalible'
        }
    }
}

// Execute keepFresh check wlhile mongoose populate (populate is using find() method)
nakedshortSchema.pre('find', async function () {
    try {
        const Model = mongoose.model(this.model.modelName)
        const _stock_id = this.getQuery()._stock_id['$in'][0]

        const instance = await Model.findOne({
            _stock_id
        })

        if (!instance) {
            // Find ticker
            const ticker = (await Stock.findById(_stock_id)).ticker
            // Create
            await Model.createRecord(ticker, _stock_id)
        } else {
            // Update
            await Model.keepFresh()
        }

    } catch (error) {
        return {
            error: 'nakedshort pre.find error!'
        }
    }
})

nakedshortSchema.loadClass(StockModule)

export const Nakedshort = mongoose.model('Nakedshort', nakedshortSchema)