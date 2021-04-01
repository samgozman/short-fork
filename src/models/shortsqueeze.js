const mongoose = require('mongoose')
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
    _ticker: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    squeeze_short_flow: {
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
            _ticker: ticker,
            squeeze_short_flow: squeeze ? squeeze.shortPercentOfFloat : null
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
        this.overwrite({
            _stock_id: this._stock_id,
            ...(await Shortsqueeze.getDataFromFinviz(this._ticker))
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
shortsqueezeSchema.methods.keepFresh = async function (ttl = 1200000) {
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
shortsqueezeSchema.pre('find', async function () {
    try {
        const _stock_id = this.getQuery()._stock_id['$in'][0]
        const squeeze = await Shortsqueeze.findOne({
            _stock_id
        })

        await squeeze.keepFresh()
    } catch (error) {
        return {
            error: 'shortsqueeze pre.find error!'
        }
    }
})

const Shortsqueeze = mongoose.model('Shortsqueeze', shortsqueezeSchema)

module.exports = Shortsqueeze