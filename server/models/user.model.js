var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
    nombre: String,
    usuario: String,
    contraseña: String,
    modoBot: Number,
    imagen:String
})


module.exports = mongoose.model('Usuario',userSchema)