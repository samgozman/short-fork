import mongoose from 'mongoose'
import StockModule from '../db/StockModule.mjs'
import timeout from '../utils/timeout.mjs'
import * as shortsqueeze from 'shortsqueeze'

// Class mongoose.Schema for shortsqueeze instance
const shortsqueezeSchema = mongoose.Schema({
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
shortsqueezeSchema.statics.getFromSource = async function (ticker) {
    try {
        const squeeze = await timeout(shortsqueeze(ticker))

        return {
            short_flow: squeeze ? squeeze.shortPercentOfFloat : null,
            _ttl: process.env.TTL_SHORTSQUEEZE
        }
    } catch (error) {
        return {
            error: 'Shortsqueeze service is unavalible'
        }
    }
}

shortsqueezeSchema.loadClass(StockModule)
shortsqueezeSchema.pre('find', shortsqueezeSchema.methods.preFind)

export const Shortsqueeze = mongoose.model('Shortsqueeze', shortsqueezeSchema)