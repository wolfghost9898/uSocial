const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const app = express()
const dotenv = require('dotenv');
dotenv.config();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false,limit: '50mb' }));

app.use('/api/auth', require('./routes/auth.route'))


app.listen(PORT,'0.0.0.0',() =>{
    console.log('Server running on port ',PORT)
})