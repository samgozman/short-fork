const mongoose = require('mongoose')
const Stock = require('../models/stock')
const timeout = require('../utils/timeout')
const shortsqueeze = require('shortsqueeze')

// Class schema for shortsqueeze instance
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

// Get data from shortsqueeze.com
shortsqueezeSchema.statics.getDataFromFinviz = async (ticker = '') => {
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

// Create object in DB. obj is optional - if data was fetched earlier 
shortsqueezeSchema.statics.createRecord = async (ticker = '', _stock_id = '', obj) => {
    let squeeze = await Shortsqueeze.findOne({
        _stock_id
    })

    // Overwrite if exist
    if (squeeze) {
        squeeze.overwrite({
            _stock_id,
            ...(await Shortsqueeze.getDataFromFinviz(ticker))
        })
    } else {
        // Create if not
        squeeze = new Shortsqueeze(obj ? {
            _stock_id,
            ...obj
        } : {
            _stock_id,
            ...(await Shortsqueeze.getDataFromFinviz(ticker))
        })
    }

    await squeeze.save()
    return squeeze
}

// Get obj by _stock_id
shortsqueezeSchema.statics.findByStockId = async (ticker = '', _stock_id = '') => {
    try {
        let squeeze = await Shortsqueeze.findOne({
            _stock_id
        })

        if (!squeeze) {
            return await Shortsqueeze.createRecord(ticker, _stock_id)
        }

        return await squeeze.keepFresh()
    } catch (error) {
        return {
            error: error.message
        }
    }
}

shortsqueezeSchema.methods.updateRecord = async function () {
    try {
        const ticker = (await Stock.findById(this._stock_id)).ticker
        this.overwrite({
            _stock_id: this._stock_id,
            ...(await Shortsqueeze.getDataFromFinviz(ticker))
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
shortsqueezeSchema.methods.keepFresh = async function (ttl = process.env.TTL_SHORTSQUEEZE) {
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
shortsqueezeSchema.methods.toJSON = function () {
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
shortsqueezeSchema.pre('find', async function () {
    try {
        const _stock_id = this.getQuery()._stock_id['$in'][0]
        const squeeze = await Shortsqueeze.findOne({
            _stock_id
        })

        if (!squeeze) {
            // Find ticker
            const ticker = (await Stock.findById(_stock_id)).ticker
            // Create
            await Shortsqueeze.createRecord(ticker, _stock_id)
        } else {
            // Update
            await squeeze.keepFresh()
        }
    } catch (error) {
        return {
            error: 'shortsqueeze pre.find error!'
        }
    }
})

const Shortsqueeze = mongoose.model('Shortsqueeze', shortsqueezeSchema)

module.exports = Shortsqueeze