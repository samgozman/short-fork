import mongoose from 'mongoose'
import { Stock } from './stock.mjs'
import timeout from '../utils/timeout.mjs'
import { quotes } from 'barchart-dot-com'

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
barchartOverviewSchema.statics.getFromSource = async (ticker) => {
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

/**
 * Create object in DB. obj is optional - if data was fetched earlier 
 * @async
 * @param {String} ticker Stocks ticker
 * @param {String} _stock_id ID of the parent stock to which this data belongs
 * @param {Object} [obj] (optional) An object with pre-prepared data in case it was fetched earlier
 * @return {Object} MongoDB barchartOverview saved object
 */
barchartOverviewSchema.statics.createRecord = async (ticker, _stock_id, obj) => {
    let barchartoverview = await BarchartOverview.findOne({
        _stock_id
    })

    // Overwrite if exist
    if (barchartoverview) {
        barchartoverview.overwrite({
            _stock_id,
            ...(await BarchartOverview.getFromSource(ticker))
        })
    } else {
        // Create if not
        barchartoverview = new BarchartOverview(obj ? {
            _stock_id,
            ...obj
        } : {
            _stock_id,
            ...(await BarchartOverview.getFromSource(ticker))
        })
    }

    await barchartoverview.save()
    return barchartoverview
}

/**
 * Get obj by _stock_id
 * @async
 * @param {String} ticker Stocks ticker
 * @param {String} _stock_id ID of the parent stock to which this data belongs
 * @return {Object} MongoDB barchartOverview object
 */
barchartOverviewSchema.statics.findByStockId = async (ticker, _stock_id) => {
    try {
        let barchartoverview = await BarchartOverview.findOne({
            _stock_id
        })

        if (!barchartoverview) {
            ticker = ticker.toUpperCase().trim()
            return await BarchartOverview.createRecord(ticker, _stock_id)
        }

        return await barchartoverview.keepFresh()
    } catch (error) {
        return {
            error: error.message
        }
    }
}

/**
 * Update existing data
 * @async
 * @return {Object} Updated MongoDB barchartOverview object
 */
barchartOverviewSchema.methods.updateRecord = async function () {
    try {
        const ticker = (await Stock.findById(this._stock_id)).ticker
        this.overwrite({
            _stock_id: this._stock_id,
            ...(await BarchartOverview.getFromSource(ticker))
        })
        await this.save()
        return this
    } catch (error) {
        return {
            error: 'updateRecord error'
        }
    }
}

/**
 * Method for keeping things fresh
 * @async
 * @param {Number} [ttl] Time to Live param which limits the lifespan of data  
 * @return {Object} Refreshed MongoDB barchartOverview
 */
barchartOverviewSchema.methods.keepFresh = async function (ttl = process.env.TTL_BARCHART_OVERVIEW) {
    try {
        if ((new Date() - this.updatedAt) > ttl) {
            return await this.updateRecord()
        }
        return this
    } catch (error) {
        return {
            error: 'keepFresh error'
        }
    }
}

/**
 * TWEAK: Hide unnecessary data!
 * @example https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior
 * @return {Object} object
 */
barchartOverviewSchema.methods.toJSON = function () {
    const data = this
    const dataObj = data.toObject()

    delete dataObj._stock_id
    delete dataObj._id
    delete dataObj.__v
    delete dataObj.createdAt
    delete dataObj.updatedAt

    return dataObj
}

// Execute keepFresh check wlhile mongoose populate (populate is using find() method)
barchartOverviewSchema.pre('find', async function () {
    try {
        const _stock_id = this.getQuery()._stock_id['$in'][0]
        const barchartoverview = await BarchartOverview.findOne({
            _stock_id
        })

        if (!barchartoverview) {
            // Find ticker
            const ticker = (await Stock.findById(_stock_id)).ticker
            // Create
            await BarchartOverview.createRecord(ticker, _stock_id)
        } else {
            // Update
            await barchartoverview.keepFresh()
        }

    } catch (error) {
        return {
            error: 'BarchartOverview pre.find error!'
        }
    }
})

export const BarchartOverview = mongoose.model('BarchartOverview', barchartOverviewSchema)