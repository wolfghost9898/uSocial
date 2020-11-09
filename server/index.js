'use strict'
const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const app = express()
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const socketIo = require('socket.io')
var logger = require('morgan');
dotenv.config();


app.use(logger('dev'));
app.use(cors())
app.use(bodyParser.json({limit: '70mb'}));
app.use(bodyParser.urlencoded({ extended: true,limit: '70mb', parameterLimit: 70000 }));



const host = process.env.HOST || 'localhost';
const db = process.env.DB || 'proyecto';
const puerto = process.env.PORTdb || 27017;

const dbConnectionUrl = `mongodb://10.0.0.251:${puerto}/${db}`;

app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/amigo',require('./routes/amigos.route'))
app.use('/api/chat',require('./routes/chat.route'))
app.use('/api/publicacion',require('./routes/publicacion.route'))

mongoose.connect(dbConnectionUrl,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Base de Datos conectada Correctamente")
)

const server = app.listen(PORT,'0.0.0.0',() =>{
    console.log('Server running on port ',PORT)
})


//Socket
global.io = socketIo(server)
let interval
global.io.origins('*:*')
global.io.on('connection', (socket) =>{
    console.log("Nuevo cliente conectado")
    socket.on('disconnect' , () =>{
        console.log("Cliente Desconectado")
    })
})

const getApiandEmit = socket => {
    const response = new Date();
    socket.emit("FromAPI", response)
}


