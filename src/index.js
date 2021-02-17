const app = require('./app')

// Use server-provided port or use dev 3000 if not
const port = process.env.PORT

app.listen(port, async () => {
    console.log('Server is up on port ' + port)
})