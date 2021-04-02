const mongoose = require('mongoose')
const Stock = require('../models/stock')
const timeout = require('../utils/timeout')
const finvizor = require('finvizor')

// Class schema for Finviz instance
const finvizSchema = mongoose.Schema({
    _stock_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Stock'
    },
    name: {
        type: String
    },
    price: {
        type: Number
    },
    pe: {
        type: Number,
        default: null
    },
    ps: {
        type: Number,
        default: null
    },
    pb: {
        type: Number,
        default: null
    },
    roe: {
        type: Number,
        default: null
    },
    roa: {
        type: Number,
        default: null
    },
    debteq: {
        type: Number,
        default: null
    },
    short_flow: {
        type: Number,
        default: null
    },
    target_price: {
        type: Number,
        default: null
    },
    rsi: {
        type: Number,
        default: null
    },
    recomendation: {
        type: Number,
        default: null
    },
    site: {
        type: String,
        default: null
    },
    peg: {
        type: Number,
        default: null
    },
    dividend_percent: {
        type: Number,
        default: null
    }
}, {
    timestamps: true
})

// Get data from finviz.com
finvizSchema.statics.getDataFromFinviz = async (ticker = '') => {
    try {
        const fin = await timeout(finvizor.stock(ticker.trim()))

        if (fin.error) {
            console.log(fin.error)
            return undefined
        }

        return {
            name: fin.name,
            price: fin.price,
            pe: fin.pe,
            ps: fin.ps,
            pb: fin.pb,
            roe: fin.roe,
            roa: fin.roa,
            debteq: fin.debtEq,
            short_flow: fin.shortFloat,
            target_price: fin.targetPrice,
            rsi: fin.rsi,
            recomendation: fin.recom ? fin.recom.toFixed(1) : null,
            site: fin.site,
            peg: fin.peg,
            dividend_percent: fin.dividendPercent
        }
    } catch (error) {
        return {
            error: 'Finviz service is unavalible'
        }
    }

}

// Create object in DB. obj is optional - if data was fetched earlier 
finvizSchema.statics.createRecord = async (ticker = '', _stock_id = '', obj) => {
    let fin = await Finviz.findOne({
        _stock_id
    })

    // Overwrite if exist
    if (fin) {
        fin.overwrite({
            _stock_id,
            ...(await Finviz.getDataFromFinviz(ticker))
        })
    } else {
        // Create if not
        fin = new Finviz(obj ? {
            _stock_id,
            ...obj
        } : {
            _stock_id,
            ...(await Finviz.getDataFromFinviz(ticker))
        })
    }

    await fin.save()
    return fin
}

// Get obj by _stock_id
finvizSchema.statics.findByStockId = async (ticker = '', _stock_id = '') => {
    try {
        let fin = await Finviz.findOne({
            _stock_id
        })

        if (!fin) {
            return await Finviz.createRecord(ticker, _stock_id)
        }

        return await fin.keepFresh()
    } catch (error) {
        return {
            error: error.message
        }
    }
}

finvizSchema.methods.updateRecord = async function () {
    try {
        const ticker = (await Stock.findById(this._stock_id)).ticker
        this.overwrite({
            _stock_id: this._stock_id,
            ...(await Finviz.getDataFromFinviz(ticker))
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
finvizSchema.methods.keepFresh = async function (ttl = process.env.TTL_FINVIZ) {
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
finvizSchema.methods.toJSON = function () {
    const data = this
    const dataObj = data.toObject()

    delete dataObj._stock_id
    delete dataObj._id
    delete dataObj.__v
    delete dataObj.createdAt

    return dataObj
}

// Execute keepFresh check wlhile mongoose populate (populate is using find() method)
finvizSchema.pre('find', async function () {
    try {
        const _stock_id = this.getQuery()._stock_id['$in'][0]
        const fin = await Finviz.findOne({
            _stock_id
        })

        if (!fin) {
            // Find ticker
            const ticker = (await Stock.findById(_stock_id)).ticker
            // Create
            await Finviz.createRecord(ticker, _stock_id)
        } else {
            // Update
            await fin.keepFresh()
        }

    } catch (error) {
        return {
            error: 'finviz pre.find error!'
        }
    }
})

const Finviz = mongoose.model('Finviz', finvizSchema)

module.exports = Finviz