var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
    nombre: String,
    usuario: String,
    contraseña: String,
    imagen:String,
    bot: Number
})


module.exports = mongoose.model('Usuario',userSchema)