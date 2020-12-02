var mongoose = require('mongoose')
var Schema = mongoose.Schema

var chatSchema = new Schema({
    emisor: String,
    receptor: String,
    mensaje: String
})


module.exports = mongoose.model('Chat',chatSchema)