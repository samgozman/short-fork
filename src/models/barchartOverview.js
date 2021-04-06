const mongoose = require('mongoose')
const Stock = require('../models/stock')
const timeout = require('../utils/timeout')
const {
    quotes
} = require('barchart-dot-com')

// Class schema for Finviz instance
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
    technicals: {
        buy: {
            type: Boolean
        },
        power: {
            type: Number,
            default: null
        }
    },
    analytics: {
        strongBuy: {
            type: Number,
            default: null
        },
        moderateBuy: {
            type: Number,
            default: null
        },
        hold: {
            type: Number,
            default: null
        },
        moderateSell: {
            type: Number,
            default: null
        },
        strongSell: {
            type: Number,
            default: null
        }
    }
}, {
    timestamps: true
})

// Get data from finviz.com
barchartOverviewSchema.statics.getDataFromFinviz = async (ticker = '') => {
    try {
        const barchartOverview = await timeout(await quotes.overview(ticker.trim()))

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
            technicals: {
                buy: barchartOverview.technicals.opinion === 'Buy' ? true : false,
                power: barchartOverview.technicals.power || null
            },
            analytics: {
                strongBuy: barchartOverview.analytics.strongBuy || null,
                moderateBuy: barchartOverview.analytics.moderateBuy || null,
                hold: barchartOverview.analytics.hold || null,
                moderateSell: barchartOverview.analytics.moderateSell || null,
                strongSell: barchartOverview.analytics.strongSell || null
            }
        }
    } catch (error) {
        return {
            error: 'Barchart Overview service is unavalible'
        }
    }
}

// Create object in DB. obj is optional - if data was fetched earlier 
barchartOverviewSchema.statics.createRecord = async (ticker = '', _stock_id = '', obj) => {
    let barchartoverview = await BarchartOverview.findOne({
        _stock_id
    })

    // Overwrite if exist
    if (barchartoverview) {
        barchartoverview.overwrite({
            _stock_id,
            ...(await BarchartOverview.getDataFromFinviz(ticker))
        })
    } else {
        // Create if not
        barchartoverview = new BarchartOverview(obj ? {
            _stock_id,
            ...obj
        } : {
            _stock_id,
            ...(await BarchartOverview.getDataFromFinviz(ticker))
        })
    }

    await barchartoverview.save()
    return barchartoverview
}

// Get obj by _stock_id
barchartOverviewSchema.statics.findByStockId = async (ticker = '', _stock_id = '') => {
    try {
        let barchartoverview = await BarchartOverview.findOne({
            _stock_id
        })

        if (!barchartoverview) {
            return await BarchartOverview.createRecord(ticker, _stock_id)
        }

        return await barchartoverview.keepFresh()
    } catch (error) {
        return {
            error: error.message
        }
    }
}

barchartOverviewSchema.methods.updateRecord = async function () {
    try {
        const ticker = (await Stock.findById(this._stock_id)).ticker
        this.overwrite({
            _stock_id: this._stock_id,
            ...(await BarchartOverview.getDataFromFinviz(ticker))
        })
        await this.save()
        return this
    } catch (error) {
        return {
            error: 'updateRecord error'
        }
    }
}

// Method for keeping things fresh
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

const BarchartOverview = mongoose.model('BarchartOverview', barchartOverviewSchema)

module.exports = BarchartOverview