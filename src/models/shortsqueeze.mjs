import mongoose from 'mongoose'
import {
    Stock
} from './stock.mjs'
import StockModule from '../db/StockModule.mjs'
import timeout from '../utils/timeout.mjs'
import shortsqueeze from 'shortsqueeze'

// Class mongoose.Schema for shortsqueeze instance
const shortsqueezeSchema = mongoose.Schema({
    _stock_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Stock'
    },
    short_flow: {
        type: Number,
        default: null
    }
}, {
    timestamps: true
})

/**
 * Get financial data from shortsqueeze.com
 * @async
 * @param {String} ticker Stocks ticker
 * @return {Object} debt, equity, revenue etc..
 */
shortsqueezeSchema.statics.getFromSource = async (ticker) => {
    try {
        const squeeze = await timeout(shortsqueeze(ticker))

        return {
            short_flow: squeeze ? squeeze.shortPercentOfFloat : null
        }
    } catch (error) {
        return {
            error: 'Shortsqueeze service is unavalible'
        }
    }
}

// Execute keepFresh check wlhile mongoose populate (populate is using find() method)
shortsqueezeSchema.pre('find', async function () {
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
            error: 'shortsqueeze pre.find error!'
        }
    }
})

shortsqueezeSchema.loadClass(StockModule)

export const Shortsqueeze = mongoose.model('Shortsqueeze', shortsqueezeSchema)