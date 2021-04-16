// Increment stock counter
const counter = async (req, res, next) => {
    try {
        res.stock._counter++
        await res.stock.save()
        next()
    } catch (error) {
        res.status(401).send({
            error: 'Stock counter error'
        })
    }
}

export default counter