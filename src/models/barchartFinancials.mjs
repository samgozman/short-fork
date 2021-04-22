import mongoose from 'mongoose'
import {
    Stock
} from './stock.mjs'
import timeout from '../utils/timeout.mjs'
import {
    financials
} from 'barchart-dot-com'

// Class mongoose.Schema for Barchart Financials instance
const barchartFinancialsSchema = mongoose.Schema({
    _stock_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Stock'
    },
    longTermDebt: {
        type: Array
    },
    shareholdersEquity: {
        type: Array
    },
    netIncome: {
        type: Array
    },
    revenue: {
        type: Array
    },
    dates: {
        type: Array
    }
}, {
    timestamps: true
})

/**
 * Get financial data from Barchart Financials
 * @async
 * @param {String} ticker Stocks ticker
 * @return {Object} debt, equity, revenue etc..
 */
barchartFinancialsSchema.statics.getFromSource = async function (ticker) {
    try {
        const barchartFinancialsBalance = await timeout(financials.balanceSheet().annual(ticker))
        const barchartFinancialsIncome = await timeout(financials.income().annual(ticker))

        if (barchartFinancialsBalance.error || barchartFinancialsIncome.error) {
            return undefined
        }

        const startsWith = (barchartFinancialsIncome.startsWith).split('-')
        const dates = []
        for (let i = 0; i < barchartFinancialsIncome.periods; i++) {
            dates.push(startsWith[0] + '-' + Number(startsWith[1] - i))
        }

        const liabilities = barchartFinancialsBalance.liabilities
        const longDebt = liabilities.nonCurrentLiabilities.longTermDebt ? liabilities.nonCurrentLiabilities.longTermDebt : liabilities.longTermDebt ? liabilities.longTermDebt : null
        const shortDebt = liabilities.currentLiabilities.total ? liabilities.currentLiabilities.total : null

        return {
            longTermDebt: longDebt ? [...longDebt].reverse() : [...shortDebt].reverse(),
            shareholdersEquity: [...barchartFinancialsBalance.shareholdersEquity.total].reverse(),
            netIncome: [...barchartFinancialsIncome.netIncome].reverse(),
            revenue: [...barchartFinancialsIncome.sales].reverse(),
            dates: [...dates].reverse()
        }
    } catch (error) {
        return {
            error: 'Barchart Financials service is unavalible'
        }
    }
}

/**
 * Create object in DB. obj is optional - if data was fetched earlier 
 * @async
 * @param {String} ticker Stocks ticker
 * @param {String} _stock_id ID of the parent stock to which this data belongs
 * @param {Object} [obj] (optional) An object with pre-prepared data in case it was fetched earlier
 * @return {Object} MongoDB barchartFinancials saved object
 */
barchartFinancialsSchema.statics.createRecord = async function (ticker, _stock_id, obj) {
    try {
        let barchartFinancials = await this.findOne({
            _stock_id
        })

        // Overwrite if exist
        if (barchartFinancials) {
            barchartFinancials.overwrite({
                _stock_id,
                ...(await this.getFromSource(ticker))
            })
        } else {
            // Create if not
            barchartFinancials = new this(obj ? {
                _stock_id,
                ...obj
            } : {
                _stock_id,
                ...(await this.getFromSource(ticker))
            })
        }

        await barchartFinancials.save()
        return barchartFinancials
    } catch (error) {
        return {
            error: 'Error in statics.createRecord'
        }
    }

}

/**
 * Get obj by _stock_id
 * @async
 * @param {String} ticker Stocks ticker
 * @param {String} _stock_id ID of the parent stock to which this data belongs
 * @return {Object} MongoDB barchartFinancials object
 */
barchartFinancialsSchema.statics.findByStockId = async function (ticker, _stock_id) {
    try {
        let barchartFinancials = await this.findOne({
            _stock_id
        })

        if (!barchartFinancials) {
            ticker = ticker.toUpperCase().trim()
            return await this.createRecord(ticker, _stock_id)
        }

        return await barchartFinancials.keepFresh()
    } catch (error) {
        return {
            error: error.message
        }
    }
}

/**
 * Update existing data
 * @async
 * @return {Object} Updated MongoDB barchartFinancials object
 */
barchartFinancialsSchema.methods.updateRecord = async function () {
    try {
        const model = mongoose.model(this.constructor.modelName)
        const ticker = (await Stock.findById(this._stock_id)).ticker
        this.overwrite({
            _stock_id: this._stock_id,
            ...(await model.getFromSource(ticker))
        })
        await this.save()
        return this
    } catch (error) {
        return {
            error: 'BarchartFinancials updateRecord error'
        }
    }
}


/**
 * Method for keeping things fresh
 * @async
 * @param {Number} [ttl] Time to Live param which limits the lifespan of data  
 * @return {Object} Refreshed MongoDB barchartFinancials
 */
barchartFinancialsSchema.methods.keepFresh = async function (ttl = process.env.TTL_BARCHART_FINANCIAL) {
    try {
        if ((new Date() - this.updatedAt) > ttl) {
            return await this.updateRecord()
        }
        return this
    } catch (error) {
        return {
            error: 'BarchartFinancials keepFresh error'
        }
    }
}

/**
 * TWEAK: Hide unnecessary data!
 * @example https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior
 * @return {Object} object
 */
barchartFinancialsSchema.methods.toJSON = function () {
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
barchartFinancialsSchema.pre('find', async function () {
    try {
        const model = mongoose.model(this.model.modelName)
        const _stock_id = this.getQuery()._stock_id['$in'][0]

        const barchartFinancials = await model.findOne({
            _stock_id
        })

        if (!barchartFinancials) {
            // Find ticker
            const ticker = (await Stock.findById(_stock_id)).ticker
            // Create
            await model.createRecord(ticker, _stock_id)
        } else {
            // Update
            await model.keepFresh()
        }

    } catch (error) {
        return {
            error: 'BarchartFinancials pre.find error!'
        }
    }
})

export const BarchartFinancials = mongoose.model('BarchartFinancials', barchartFinancialsSchema)