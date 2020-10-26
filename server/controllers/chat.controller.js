const chatModel = require('../models/chat.model');

const enviar = async (req, res) => {
    let { emisor, receptor, mensaje } = req.body
    //console.log((receptor + "-" + emisor))
    let nuevoMensaje = new chatModel({
        emisor: emisor,
        receptor: receptor,
        mensaje: mensaje
    })

    nuevoMensaje.save(err => {
        if (err) {
            return res.send({
                status: 400,
                msg: err
            })
        }
        global.io.emit(receptor + "-" + emisor, mensaje)

        return res.send({
            status: 200,
            msg: "Enviado correctamente"
        })
    })
   
}

const getConversion = async(req,res) =>{
    let{usuario1,usuario2} = req.params

    chatModel.find({$or:[{emisor:usuario1,receptor:usuario2},{emisor:usuario2,receptor:usuario1}]}, (err,data) =>{
        if(err){
            return res.send({
                status: 400,
                msg : err
            })
        }
        return res.send({
            status:200,
            msg: data
        })
    })
}

module.exports = {
    enviar,
    getConversion
}