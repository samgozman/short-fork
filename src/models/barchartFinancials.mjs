import mongoose from 'mongoose'
import { Stock } from './stock.mjs'
import timeout from '../utils/timeout.mjs'
import { financials } from 'barchart-dot-com'

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

// Get data from finviz.com
barchartFinancialsSchema.statics.getDataFromFinviz = async (ticker = '') => {
    try {
        const barchartFinancialsBalance = await timeout(await financials.balanceSheet().annual(ticker.trim()))
        const barchartFinancialsIncome = await timeout(await financials.income().annual(ticker.trim()))

        if (barchartFinancialsBalance.error || barchartFinancialsIncome.error) {
            return undefined
        }

        const startsWith = (barchartFinancialsIncome.startsWith).split('-')
        const dates = []
        for (let i = 0; i < barchartFinancialsIncome.periods; i++) {
            dates.push(startsWith[0] + '-' + Number(startsWith[1] - i))
        }

        const liabilities = barchartFinancialsBalance.liabilities
        const longDebt = liabilities.nonCurrentLiabilities.longTermDebt ? liabilities.nonCurrentLiabilities.longTermDebt.reverse() : liabilities.longTermDebt ? liabilities.longTermDebt.reverse() : null
        const shortDebt = liabilities.currentLiabilities.total ? liabilities.currentLiabilities.total.reverse() : null
        
        return {
            longTermDebt: longDebt ? longDebt : shortDebt,
            shareholdersEquity: barchartFinancialsBalance.shareholdersEquity.total.reverse(),
            netIncome: barchartFinancialsIncome.netIncome.reverse(),
            revenue: barchartFinancialsIncome.sales.reverse(),
            dates: dates.reverse()
        }
    } catch (error) {
        return {
            error: 'Barchart Financials service is unavalible'
        }
    }
}

// Create object in DB. obj is optional - if data was fetched earlier 
barchartFinancialsSchema.statics.createRecord = async (ticker = '', _stock_id = '', obj) => {
    let barchartFinancials = await BarchartFinancials.findOne({
        _stock_id
    })

    // Overwrite if exist
    if (barchartFinancials) {
        barchartFinancials.overwrite({
            _stock_id,
            ...(await BarchartFinancials.getDataFromFinviz(ticker))
        })
    } else {
        // Create if not
        barchartFinancials = new BarchartFinancials(obj ? {
            _stock_id,
            ...obj
        } : {
            _stock_id,
            ...(await BarchartFinancials.getDataFromFinviz(ticker))
        })
    }

    await barchartFinancials.save()
    return barchartFinancials
}

// Get obj by _stock_id
barchartFinancialsSchema.statics.findByStockId = async (ticker = '', _stock_id = '') => {
    try {
        let barchartFinancials = await BarchartFinancials.findOne({
            _stock_id
        })

        if (!barchartFinancials) {
            return await BarchartFinancials.createRecord(ticker, _stock_id)
        }

        return await barchartFinancials.keepFresh()
    } catch (error) {
        return {
            error: error.message
        }
    }
}

barchartFinancialsSchema.methods.updateRecord = async function () {
    try {
        const ticker = (await Stock.findById(this._stock_id)).ticker
        this.overwrite({
            _stock_id: this._stock_id,
            ...(await BarchartFinancials.getDataFromFinviz(ticker))
        })
        await this.save()
        return this
    } catch (error) {
        return {
            error: 'BarchartFinancials updateRecord error'
        }
    }
}

// Method for keeping things fresh
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
        const _stock_id = this.getQuery()._stock_id['$in'][0]
        const barchartFinancials = await BarchartFinancials.findOne({
            _stock_id
        })

        if (!barchartFinancials) {
            // Find ticker
            const ticker = (await Stock.findById(_stock_id)).ticker
            // Create
            await BarchartFinancials.createRecord(ticker, _stock_id)
        } else {
            // Update
            await barchartFinancials.keepFresh()
        }

    } catch (error) {
        return {
            error: 'BarchartFinancials pre.find error!'
        }
    }
})

export const BarchartFinancials = mongoose.model('BarchartFinancials', barchartFinancialsSchema)