const express = require('express')
const path  = require('path')

const app = express()
const port = process.env.PORT || 3000
const public_dir = path.join(__dirname, '../public')

// Setup static directory to serve
app.use(express.static(public_dir))

// root index page
app.get('', (req, res) => {
    res.sendFile(path.join(public_dir, 'index.html'))
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})