const solicitudModel = require('../models/solicitud.model')
const userModel = require('../models/user.model');

const solicitud = async(req,res) =>{
    let{emisor,receptor} = req.body.datos
    
    if(emisor === receptor){
        return res.send({
            status:400,
            msg: "No puedes enviarte solicitud a ti mismo :p" 
        })
    }
    
    const user = await userModel.findOne({usuario: receptor})
    if(!user){
        return res.send({
            status:400,
            msg: "El usuario: " + receptor + " no existe" 
        })
    }

    const solicitud = await solicitudModel.findOne({emisor:emisor,receptor:receptor})
    if(solicitud){
        return res.send({
            status:400,
            msg: "Solicitud ya enviada"
        })
    }

    let nuevaSolicitud = solicitudModel({
        emisor: emisor,
        receptor: receptor
    })

    nuevaSolicitud.save(err =>{
        if(err){
            return res.send({
                status: 400,
                msg : err
            })
        }

        return res.send({
            status: 200,
            msg: "Solicitud enviada con exito"
        })
    })
}

const getSolicitudes = async(req,res) =>{
    let {usuario} = req.params  
    
    solicitudModel.find({receptor:usuario},(err,data) =>{
        if(err){
            return res.send({
                status: 400,
                msg: err
            })
        }
        return res.send({
            status: 200,
            msg:data
        })
    })
}

module.exports = {
    solicitud,
    getSolicitudes
}