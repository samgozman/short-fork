const mongoose = require('mongoose')
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
    _ticker: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
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
    finviz_short_flow: {
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
            _ticker: fin.ticker,
            name: fin.name,
            price: fin.price,
            pe: fin.pe,
            ps: fin.ps,
            pb: fin.pb,
            roe: fin.roe,
            roa: fin.roa,
            debteq: fin.debtEq,
            finviz_short_flow: fin.shortFloat,
            target_price: fin.targetPrice,
            rsi: fin.rsi,
            recomendation: fin.recom ? fin.recom.toFixed(1) : null,
            site: fin.site
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
        this.overwrite({
            _stock_id: this._stock_id,
            ...(await Finviz.getDataFromFinviz(this._ticker))
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
finvizSchema.methods.keepFresh = async function (ttl = 1200000) {
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
finvizSchema.pre('find', async function () {
    try {
        const _stock_id = this.getQuery()._stock_id['$in'][0]
        const fin = await Finviz.findOne({
            _stock_id
        })

        await fin.keepFresh()
    } catch (error) {
        return {
            error: 'finviz pre.find error!'
        }
    }
})

const Finviz = mongoose.model('Finviz', finvizSchema)

module.exports = Finviz