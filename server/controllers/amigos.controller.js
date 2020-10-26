const solicitudModel = require('../models/solicitud.model')
const userModel = require('../models/user.model');
const amigosModel = require('../models/amigos.model')

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

    const amigos = await amigosModel.findOne({usuario1:emisor,usuario2:receptor})
    if(amigos){
        return res.send({
            status:400,
            msg: "Ya son amigos :p"
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


const addAmigo = async(req,res) =>{
    let {usuario1,usuario2} = req.body.datos 

    let usuario = await userModel.findOne({usuario:usuario1})
    if(!usuario){
        return res.send({
            status:400,
            msg: "El usuario: " + usuario1 + " no existe" 
        })
    }

    usuario = await userModel.findOne({usuario:usuario2})
    if(!usuario){
        return res.send({
            status:400,
            msg: "El usuario: " + usuario2 + " no existe" 
        })
    }

    let amigo1 = new amigosModel({
        usuario1 : usuario1,
        usuario2 : usuario2
    })

    let amigo2 = new amigosModel({
        usuario1 : usuario2,
        usuario2 : usuario1
    })
    Promise.all([
        amigo1.save(),
        amigo2.save(),
        solicitudModel.deleteOne({emisor:usuario1, receptor:usuario2})
    ]).then(([amigo1,amigo2,eliminado]) =>{
        return res.send({
            status:200,
            msg: "Amigo Agregado con exito"
        })
    }).catch((error) =>{
        return res.send({
            status:400,
            msg: error
        })
    })
}


const rechazar = async(req,res) =>{
    let {usuario1,usuario2} = req.body.datos 
    solicitudModel.deleteOne({emisor:usuario1, receptor:usuario2}, (err,data) =>{
        if(err){
            return res.send({
                status:400,
                msg: err 
            })  
        }
        return res.send({
            status:200,
            msg: "Solicitud rechazada" 
        })
    })
}


const getAmigos = async(req,res) =>{
    let { usuario } = req.params 
    amigosModel.find({usuario1:usuario},(err,data) =>{
        if(err){
            return res.send({
                status: 400,
                msg : err
            })
        }
        let promises = []
        data.forEach(usuario => {
            promises.push(userModel.findOne({usuario:usuario.usuario2}).select('nombre imagen usuario'))
        });
        
        Promise.all(promises)
        .then((data) =>{
            global.io.emit("FromApi","nepe")
            return res.send({
                status: 200,
                msg: data
            })
        }).catch((error) =>{
            console.error(error)
            return res.send({
                status: 400,
                msg: error
            })
        })

        
    })
}

module.exports = {
    solicitud,
    getSolicitudes,
    addAmigo,
    rechazar,
    getAmigos
}