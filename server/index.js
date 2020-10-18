const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 5000

const app = express()

app.use(cors())

app.use('/api/auth', require('./routes/auth.route'))


app.listen(PORT,'0.0.0.0',() =>{
    console.log('Server running on port ',PORT)
})