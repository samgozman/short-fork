import mongoose from 'mongoose'
import {
    Stock
} from '../models/stock.mjs'

class StockModule {
    /**
     * Create object in DB. obj is optional - if data was fetched earlier 
     * @async
     * @param {String} ticker Stocks ticker
     * @param {String} _stock_id ID of the parent stock to which this data belongs
     * @param {Object} [obj] (optional) An object with pre-prepared data in case it was fetched earlier
     * @return {Object} MongoDB saved model
     */
    static async createRecord(ticker, _stock_id, obj) {
        try {
            let model = await this.findOne({
                _stock_id
            })

            // Overwrite if exist
            if (model) {
                model.overwrite({
                    _stock_id,
                    ...(await this.getFromSource(ticker))
                })
            } else {
                // Create if not
                model = new this(obj ? {
                    _stock_id,
                    ...obj
                } : {
                    _stock_id,
                    ...(await this.getFromSource(ticker))
                })
            }

            await model.save()
            return model
        } catch (error) {
            return {
                error: 'Error in static createRecord()'
            }
        }
    }

    /**
     * Get obj by _stock_id
     * @async
     * @param {String} ticker Stocks ticker
     * @param {String} _stock_id ID of the parent stock to which this data belongs
     * @return {Object} MongoDB saved model
     */
    static async findByStockId(ticker, _stock_id) {
        try {
            let instance = await this.findOne({
                _stock_id
            })

            if (!instance) {
                ticker = ticker.toUpperCase().trim()
                return await this.createRecord(ticker, _stock_id)
            }

            return await instance.keepFresh(instance._ttl)
        } catch (error) {
            return {
                error: 'Error in static findByStockId()'
            }
        }
    }

    /**
     * Update existing data
     * @async
     * @return {Object} Updated MongoDB barchartFinancials object
     */
    async updateRecord() {
        try {
            const Model = mongoose.model(this.constructor.modelName)
            const ticker = (await Stock.findById(this._stock_id)).ticker
            this.overwrite({
                _stock_id: this._stock_id,
                ...(await Model.getFromSource(ticker))
            })
            await this.save()
            return this
        } catch (error) {
            return {
                error: 'Error in updateRecord()'
            }
        }
    }

    /**
     * Method for keeping things fresh
     * @async
     * @param {Number} [ttl] Time to Live param which limits the lifespan of data  
     * @return {Object} Refreshed MongoDB barchartFinancials
     */
    async keepFresh(ttl = process.env.TTL_FINVIZ) {
        try {
            if ((new Date() - this.updatedAt) > ttl) {
                return await this.updateRecord()
            }
            return this
        } catch (error) {
            return {
                error: 'Error in keepFresh()'
            }
        }
    }

    // Execute keepFresh check wlhile mongoose populate (populate is using find() method)
    async preFind() {
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
                await instance.keepFresh(instance._ttl)
            }

        } catch (error) {
            return {
                error: 'BarchartFinancials pre.find error!'
            }
        }
    }

    /**
     * TWEAK: Hide unnecessary data!
     * @example https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior
     * @return {Object} object
     */
    toJSON() {
        const data = this
        const dataObj = data.toObject()

        delete dataObj._stock_id
        delete dataObj._id
        delete dataObj._ttl
        delete dataObj.__v
        delete dataObj.createdAt
        delete dataObj.updatedAt

        return dataObj
    }
}

export default StockModule