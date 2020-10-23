var mongoose = require('mongoose')
var Schema = mongoose.Schema

var solicitudSchema = new Schema({
    emisor: String,
    receptor: String,
})


module.exports = mongoose.model('Solicitud',solicitudSchema)