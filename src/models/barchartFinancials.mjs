import mongoose from 'mongoose'
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
        const barchartFinancialsBalance = await timeout(financials.balanceSheet(ticker).annual())
        const barchartFinancialsIncome = await timeout(financials.income(ticker).annual())

        if (barchartFinancialsBalance.error || barchartFinancialsIncome.error) {
            return undefined
        }

        const startsWith = (barchartFinancialsIncome.startsWith).split('-')
        const dates = []
        for (let i = 0; i < barchartFinancialsIncome.periods; i++) {
            dates.push(startsWith[0] + '-' + Number(startsWith[1] - i))
        }

        const liabilities = barchartFinancialsBalance.liabilities
        const liabLongTermDebt = liabilities.nonCurrentLiabilities.longTermDebt ? liabilities.nonCurrentLiabilities.longTermDebt : null
        const basicLongTermDebt = liabilities.longTermDebt ? liabilities.longTermDebt : null
        
        const longDebt = liabLongTermDebt ? basicLongTermDebt : null
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

barchartFinancialsSchema.loadClass(StockModule)
barchartFinancialsSchema.pre('find', barchartFinancialsSchema.methods.preFind)

export const BarchartFinancials = mongoose.model('BarchartFinancials', barchartFinancialsSchema)