const mongoose = require('mongoose')
const Stock = require('../models/stock')
const timeout = require('../utils/timeout')
const nakedshort = require('nakedshort')

// Class schema for Nakedshort instance
const nakedshortSchema = mongoose.Schema({
    _stock_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Stock'
    },
    naked_current_short_volume: {
        type: Number,
        default: null
    },
    naked_chart: {
        type: Array,
        default: []
    },
}, {
    timestamps: true
})

// Get data from nakedshortreport
nakedshortSchema.statics.getDataFromNaked = async (ticker = '') => {
    try {
        const naked_chart = await timeout(nakedshort.getChart(ticker))

        let
            naked_length = undefined,
            naked_current_short_volume = undefined

        if (naked_chart && !naked_chart.error) {
            naked_length = naked_chart.regularVolArr.length,
                naked_current_short_volume = (naked_chart.shortVolArr[naked_length - 1] / naked_chart.regularVolArr[naked_length - 1]) * 100
        }

        return {
            naked_current_short_volume: naked_current_short_volume ? naked_current_short_volume.toFixed(2) : null,
            naked_chart: naked_chart.error ? null : naked_chart

        }
    } catch (error) {
        return {
            error: 'Nakedshort service is unavalible'
        }
    }

}

// Create object in DB. obj is optional - if data was fetched earlier 
nakedshortSchema.statics.createRecord = async (ticker = '', _stock_id = '', obj) => {
    let naked = await Nakedshort.findOne({
        _stock_id
    })

    // Overwrite if exist
    if (naked) {
        naked.overwrite({
            _stock_id,
            ...(await Nakedshort.getDataFromNaked(ticker))
        })
    } else {
        // Create if not
        naked = new Nakedshort(obj ? {
            _stock_id,
            ...obj
        } : {
            _stock_id,
            ...(await Nakedshort.getDataFromNaked(ticker))
        })
    }

    await naked.save()
    return naked
}

// Get obj by _stock_id
nakedshortSchema.statics.findByStockId = async (ticker = '', _stock_id = '') => {
    try {
        let naked = await Nakedshort.findOne({
            _stock_id
        })

        if (!naked) {
            return await Nakedshort.createRecord(ticker, _stock_id)
        }

        return await naked.keepFresh()
    } catch (error) {
        return {
            error: error.message
        }
    }
}

nakedshortSchema.methods.updateRecord = async function () {
    try {
        const ticker = (await Stock.findById(this._stock_id)).ticker
        this.overwrite({
            _stock_id: this._stock_id,
            ...(await Nakedshort.getDataFromNaked(ticker))
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
nakedshortSchema.methods.keepFresh = async function (ttl = process.env.TTL_NAKEDSHORT || 1200000) {
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

const Nakedshort = mongoose.model('Nakedshort', nakedshortSchema)

module.exports = Nakedshort