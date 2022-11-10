import mongoose from 'mongoose'
import StockModule from '../db/StockModule.mjs'
import axios from 'axios'
import timeout from '../utils/timeout.mjs'

// Class mongoose.Schema for TightShorts instance
const tightshortsSchema = mongoose.Schema({
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
 * Get financial data from TightShorts.ru
 * @async
 * @param {String} ticker Stocks ticker
 * @return {Object} debt, equity, revenue etc..
 */
tightshortsSchema.statics.getFromSource = async function (ticker) {
    try {
        const config = {
            method: 'get',
            url: `${process.env.SHORT_API_URL}/stock?ticker=${ticker}&limit=21&sort=desc`,
            headers: {
                'token': process.env.SHORT_API_KEY,
                'Content-Type': 'application/json'
            }
        }

        const api = (await timeout(axios(config))).data

        const current_short_volume = (api.volume[0].shortVolume / api.volume[0].totalVolume * 100).toFixed(2) || null
        const volume = api.volume.reverse()
        const chart = {
            regularVolArr: [],
            shortVolArr: [],
            xAxisArr: []
        }

        for (const el of volume) {
            chart.regularVolArr.push(el.totalVolume)
            chart.shortVolArr.push(el.shortVolume)
            chart.xAxisArr.push(el.date)
        }

        return {
            current_short_volume,
            chart,
            _ttl: process.env.TTL_TIGHTSHORTS

        }
    } catch (error) {
        return {
            error: 'TightShorts service is unavalible'
        }
    }
}

tightshortsSchema.loadClass(StockModule)
tightshortsSchema.pre('find', tightshortsSchema.methods.preFind)

export const Tightshorts = mongoose.model('Tightshorts', tightshortsSchema)