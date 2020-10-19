'use strict'
const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const app = express()
const dotenv = require('dotenv');
const mongoose = require('mongoose');
var logger = require('morgan');
dotenv.config();


app.use(logger('dev'));
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false,limit: '50mb' }));


const host = process.env.HOST || 'localhost';
const db = process.env.DB || 'proyecto';
const puerto = process.env.PORTdb || 27017;

const dbConnectionUrl = `mongodb://${host}:${puerto}/${db}`;

app.use('/api/auth', require('./routes/auth.route'))

mongoose.connect(dbConnectionUrl,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Base de Datos conectada Correctamente")
)

app.listen(PORT,'0.0.0.0',() =>{
    console.log('Server running on port ',PORT)
})



