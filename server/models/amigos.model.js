var mongoose = require('mongoose')
var Schema = mongoose.Schema

var amigosSchema = new Schema({
    usuario1: String,
    usuario2: String,
})


module.exports = mongoose.model('Amigos',amigosSchema)