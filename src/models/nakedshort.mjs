import mongoose from 'mongoose'
import { Stock } from './stock.mjs'
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
nakedshortSchema.statics.getFromSource = async (ticker) => {
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

/**
 * Create object in DB. obj is optional - if data was fetched earlier 
 * @async
 * @param {String} ticker Stocks ticker
 * @param {String} _stock_id ID of the parent stock to which this data belongs
 * @param {Object} [obj] (optional) An object with pre-prepared data in case it was fetched earlier
 * @return {Object} MongoDB nakedshort saved object
 */
nakedshortSchema.statics.createRecord = async (ticker, _stock_id, obj) => {
    let naked = await Nakedshort.findOne({
        _stock_id
    })

    // Overwrite if exist
    if (naked) {
        naked.overwrite({
            _stock_id,
            ...(await Nakedshort.getFromSource(ticker))
        })
    } else {
        // Create if not
        naked = new Nakedshort(obj ? {
            _stock_id,
            ...obj
        } : {
            _stock_id,
            ...(await Nakedshort.getFromSource(ticker))
        })
    }

    await naked.save()
    return naked
}

/**
 * Get obj by _stock_id
 * @async
 * @param {String} ticker Stocks ticker
 * @param {String} _stock_id ID of the parent stock to which this data belongs
 * @return {Object} MongoDB nakedshort object
 */
nakedshortSchema.statics.findByStockId = async (ticker, _stock_id) => {
    try {
        let naked = await Nakedshort.findOne({
            _stock_id
        })

        if (!naked) {
            ticker = ticker.toUpperCase().trim()
            return await Nakedshort.createRecord(ticker, _stock_id)
        }

        return await naked.keepFresh()
    } catch (error) {
        return {
            error: error.message
        }
    }
}

/**
 * Update existing data
 * @async
 * @return {Object} Updated MongoDB nakedshort object
 */
nakedshortSchema.methods.updateRecord = async function () {
    try {
        const ticker = (await Stock.findById(this._stock_id)).ticker
        this.overwrite({
            _stock_id: this._stock_id,
            ...(await Nakedshort.getFromSource(ticker))
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
 * @return {Object} Refreshed MongoDB nakedshort
 */
nakedshortSchema.methods.keepFresh = async function (ttl = process.env.TTL_NAKEDSHORT) {
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
nakedshortSchema.methods.toJSON = function () {
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
nakedshortSchema.pre('find', async function () {
    try {
        const _stock_id = this.getQuery()._stock_id['$in'][0]
        const naked = await Nakedshort.findOne({
            _stock_id
        })

        if (!naked) {
            // Find ticker
            const ticker = (await Stock.findById(_stock_id)).ticker
            // Create
            await Nakedshort.createRecord(ticker, _stock_id)
        } else {
            // Update
            await naked.keepFresh()
        }

    } catch (error) {
        return {
            error: 'nakedshort pre.find error!'
        }
    }
})

export const Nakedshort = mongoose.model('Nakedshort', nakedshortSchema)