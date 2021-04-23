import mongoose from 'mongoose'
import StockModule from '../db/StockModule.mjs'
import timeout from '../utils/timeout.mjs'
import {
    quotes
} from 'barchart-dot-com'

// Class mongoose.Schema for Barchart Overview instance
const barchartOverviewSchema = mongoose.Schema({
    _stock_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Stock'
    },
    options: {
        impliedVolatility: {
            type: Number,
            default: null
        },
        historicalVolatility: {
            type: Number,
            default: null
        },
        ivPercentile: {
            type: Number,
            default: null
        },
        ivRank: {
            type: Number,
            default: null
        },
        putCallVolRatio: {
            type: Number,
            default: null
        },
        todaysVolume: {
            type: Number,
            default: null
        },
        volumeAvg30Day: {
            type: Number,
            default: null
        },
        putCallOiRatio: {
            type: Number,
            default: null
        },
        todaysOpenInterest: {
            type: Number,
            default: null
        },
        openInt30Day: {
            type: Number,
            default: null
        }
    },
    analytics: {
        strongBuy: {
            type: Number,
            default: 0
        },
        moderateBuy: {
            type: Number,
            default: 0
        },
        hold: {
            type: Number,
            default: 0
        },
        moderateSell: {
            type: Number,
            default: 0
        },
        strongSell: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
})

/**
 * Get financial data from Barchart Overview
 * @async
 * @param {String} ticker Stocks ticker
 * @return {Object} debt, equity, revenue etc..
 */
barchartOverviewSchema.statics.getFromSource = async function (ticker) {
    try {
        const barchartOverview = await timeout(quotes.overview(ticker))

        if (barchartOverview.error) {
            console.log(barchartOverview.error)
            return undefined
        }

        return {
            options: {
                impliedVolatility: barchartOverview.options.impliedVolatility,
                historicalVolatility: barchartOverview.options.historicalVolatility,
                ivPercentile: barchartOverview.options.ivPercentile,
                ivRank: barchartOverview.options.ivRank,
                putCallVolRatio: barchartOverview.options.putCallVolRatio,
                todaysVolume: barchartOverview.options.todaysVolume,
                volumeAvg30Day: barchartOverview.options.volumeAvg30Day,
                putCallOiRatio: barchartOverview.options.putCallOiRatio,
                todaysOpenInterest: barchartOverview.options.todaysOpenInterest,
                openInt30Day: barchartOverview.options.openInt30Day
            },
            analytics: {
                strongBuy: barchartOverview.analytics.strongBuy || 0,
                moderateBuy: barchartOverview.analytics.moderateBuy || 0,
                hold: barchartOverview.analytics.hold || 0,
                moderateSell: barchartOverview.analytics.moderateSell || 0,
                strongSell: barchartOverview.analytics.strongSell || 0
            }
        }
    } catch (error) {
        return {
            error: 'Barchart Overview service is unavalible'
        }
    }
}

barchartOverviewSchema.loadClass(StockModule)
barchartOverviewSchema.pre('find', barchartOverviewSchema.methods.preFind)

export const BarchartOverview = mongoose.model('BarchartOverview', barchartOverviewSchema)