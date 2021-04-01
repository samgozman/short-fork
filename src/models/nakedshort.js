const mongoose = require('mongoose')
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
    _ticker: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
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
            _ticker: ticker,
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
        this.overwrite({
            _stock_id: this._stock_id,
            ...(await Nakedshort.getDataFromNaked(this._ticker))
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
nakedshortSchema.methods.keepFresh = async function (ttl = 1200000) {
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

// Execute keepFresh check wlhile mongoose populate (populate is using find() method)
nakedshortSchema.pre('find', async function () {
    try {
        const _stock_id = this.getQuery()._stock_id['$in'][0]
        const naked = await Nakedshort.findOne({
            _stock_id
        })

        await naked.keepFresh()
    } catch (error) {
        return {
            error: 'nakedshort pre.find error!'
        }
    }
})

const Nakedshort = mongoose.model('Nakedshort', nakedshortSchema)

module.exports = Nakedshort