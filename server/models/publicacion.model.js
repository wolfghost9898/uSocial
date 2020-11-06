var mongoose = require('mongoose')
var Schema = mongoose.Schema

var publicacionSchema = new Schema({
    usuario: String,
    texto: String,
    date: String,
    etiqueta: String,
    imagen:String
})


module.exports = mongoose.model('Publicacion',publicacionSchema)