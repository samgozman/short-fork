import mongoose from 'mongoose'
import {
    Stock
} from './stock.mjs'
import StockModule from '../db/StockModule.mjs'
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

// Execute keepFresh check wlhile mongoose populate (populate is using find() method)
barchartFinancialsSchema.pre('find', async function () {
    try {
        const Model = mongoose.model(this.model.modelName)
        const _stock_id = this.getQuery()._stock_id['$in'][0]

        const instance = await Model.findOne({
            _stock_id
        })

        if (!instance) {
            // Find ticker
            const ticker = (await Stock.findById(_stock_id)).ticker
            // Create
            await Model.createRecord(ticker, _stock_id)
        } else {
            // Update
            await Model.keepFresh()
        }

    } catch (error) {
        return {
            error: 'BarchartFinancials pre.find error!'
        }
    }
})

barchartFinancialsSchema.loadClass(StockModule)

export const BarchartFinancials = mongoose.model('BarchartFinancials', barchartFinancialsSchema)