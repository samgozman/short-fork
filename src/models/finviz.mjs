import mongoose from 'mongoose'
import StockModule from '../db/StockModule.mjs'
import timeout from '../utils/timeout.mjs'
import {
    stock
} from 'finvizor'

// Class mongoose.Schema for Finviz instance
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
    exchange: {
        type: String
    },
    price: {
        type: Number
    },
    pe: {
        type: Number,
        default: null
    },
    forwardPe: {
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
    },
    insidersDeals: {
        type: Array
    }
}, {
    timestamps: true
})

/**
 * Get financial data from Finviz
 * @async
 * @param {String} ticker Stocks ticker
 * @return {Object} debt, equity, revenue etc..
 */
finvizSchema.statics.getFromSource = async function (ticker) {
    try {
        const fin = await timeout(stock(ticker))
        const insiders_keys_to_keep = ['insiderTrading', 'relationship', 'date', 'transaction', 'value']

        if (fin.error) {
            console.log(fin.error)
            return undefined
        }

        return {
            name: fin.name,
            exchange: fin.exchange,
            price: fin.price,
            pe: fin.pe,
            forwardPe: fin.forwardPe,
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
            dividend_percent: fin.dividendPercent,
            insidersDeals: fin.insidersDeals.reduce((r, c) => [...r, Object.entries(c).reduce((b, [k, v]) => insiders_keys_to_keep.includes(k) ? {
                ...b,
                [k]: v
            } : b, {})], [])
        }
    } catch (error) {
        return {
            error: 'Finviz service is unavalible'
        }
    }
}

finvizSchema.loadClass(StockModule)
finvizSchema.pre('find', finvizSchema.methods.preFind)

export const Finviz = mongoose.model('Finviz', finvizSchema)