const AWS = require('aws-sdk');
const config = require('../config')
const dateTime = require('node-datetime');
const userModel = require('../models/user.model');
const Bcrypt = require("bcryptjs");
const crypto = require('crypto')


const conitoIdentity = new AWS.CognitoIdentityServiceProvider({region:config.userPoolRegion})

const login = async(req,res) =>{
    let {usuario, contra} = req.body.usuario
    //console.log(req.body.usuario)
    try{
        const user = await userModel.findOne({usuario: usuario})
        
        if(!user){
            return res.send({
                status: 400,
                msg : "Usuario incorrecto"
            })
        }

        const contraseñaValida = Bcrypt.compareSync(contra, user.contraseña);
        if (!contraseñaValida) {
            return res.send({
                status: 400,
                msg : "Contraseña incorrecta"
            })
        }

        //const token = generateJWT(user.id, user.usuario);

        /*res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.usuario,
            token
        });*/



        return res.send({
            status: 200,
            usuario: user.usuario,
            name: user.nombre,
            modoBot: user.modoBot,
            imagen: user.imagen,
            message: "Usuario valido"
        })

    }catch (e) {
        console.log(e);
        return res.send({
            status: 400,
            msg : e
        })
    }
}

const register = async (req, res) => {
    AWS.config.update(config.aws_remote_config)
    let { nombre, usuario, contra, imagen } = req.body.usuario
    let contraseñaEncriptada = Bcrypt.hashSync(contra, 10)
    
    let date = dateTime.create();
    let formato = date.format('Y-m-d_H_M_S');
    let identificador = usuario + "_" + formato;
    imagen = (imagen.split('base64,'))[1]
    let bitmap = Buffer.from(imagen, 'base64')

    let newUser = userModel({
        nombre: nombre,
        usuario: usuario,
        contraseña: contraseñaEncriptada,
        modoBot: '0',
        imagen: config.buckerURL + "user/" + identificador + ".png"
    })

    let s3 = new AWS.S3({
        accessKeyId: config.bucketID,
        secretAccessKey: config.bucketPassword
    })
    let params = {
        Bucket: config.bucketName + "/user",
        Key: identificador + ".png",
        Body: bitmap,
        ContentEnconding: 'base64',
        ContentType: 'image/jpg'
    }


    
    s3.upload(params,function(err,data){
        if(err){
            console.log(err)
            return res.send({
                status: 400,
                msg : err
            })
        }
        newUser.save(err =>{
            if(err){
                return res.send({
                    status: 400,
                    msg : err
                })
            }

            userAttr = [
                {Name:"email",Value:''},
                {Name:"custom:nombre",Value:nombre},
                {Name:"custom:modoBot",Value:'0'}
            ]
            let parametros = {
                ClientId: config.clientId,
                Password: contraseñaEncriptada,
                UserAttributes:userAttr,
                SecretHash: generateHash(usuario,config.secretHash,config.clientId),
                Username: usuario
            }
            
            conitoIdentity.signUp(parametros, (err,result) =>{
                if(err){
                    console.error(err)
                    return res.send({
                        status: 200,
                        msg: "Usuario creado con exito"
                    })
                }else{
                    //console.log(result)
                    return res.send({
                        status: 200,
                        msg: "Usuario creado con exito"
                    })
                    
                }
        
            })
        })
        
    })
}

const updateUsuario = async(req,res) =>{
    let { usuarioActual } = req.params  
    let { nombre, usuario, contra, modoBot, imagen} = req.body.usuario
    
    //console.log(req.params)
    //console.log(req.body.usuario)
    
    try{
        const user = await userModel.findOne({usuario: usuarioActual})    
        if(!user){
            return res.send({
                status: 400,
                msg : "Usuario incorrecto"
            })
        }

        const contraseñaValida = Bcrypt.compareSync(contra, user.contraseña);
        if (!contraseñaValida) {
            return res.send({
                status: 400,
                msg : "Contraseña incorrecta"
            })
        }

        //Modificar usuario
        if(imagen == null){
            userModel.updateOne({ usuario: usuarioActual }, {
                $set: {
                    nombre: nombre,
                    usuario: usuario,
                    modoBot: modoBot
                }
            },(err,result) =>{
                if(err){
                    return res.send({
                        status: 400,
                        msg: err
                    })
                }
    
                //Obtener usuario
                userModel.find({usuario:usuario},(err,data) =>{
                    if(err){
                        return res.send({
                            status: 400,
                            msg: err
                        })
                    }
                    return res.send({
                        status: 200,
                        usuario: data[0].usuario,
                        name: data[0].nombre,
                        modoBot: data[0].modoBot,
                        imagen: data[0].imagen,
                        msg: "Datos actualizados"
                    })
                })
            })
        }else{
            //Subir imagen a s3
            imagen = (imagen.split('base64,'))[1]
            let bitmap = Buffer.from(imagen, 'base64')
            let date = dateTime.create()
            let formato = date.format('Y-m-d_H_M_S')
            let identificador = usuario + "_" + formato
            imagen = config.buckerURL + "user/" + identificador + ".png"

            let s3 = new AWS.S3({
                accessKeyId: config.bucketID,
                secretAccessKey: config.bucketPassword
            })
            let params = {
                Bucket: config.bucketName + "/user",
                Key: identificador + ".png",
                Body: bitmap,
                ContentEnconding: 'base64',
                ContentType: 'image/jpg'
            }

            s3.upload(params,function(err,result){
                if(err){
                    console.log(err)
                    return res.send({
                        status: 400,
                        msg : err
                    })
                }
                userModel.updateOne({ usuario: usuarioActual }, {
                    $set: {
                        nombre: nombre,
                        usuario: usuario,
                        modoBot: modoBot,
                        imagen: imagen
                    }
                },(err,result) =>{
                    if(err){
                        return res.send({
                            status: 400,
                            msg: err
                        })
                    }
        
                    //Obtener usuario
                    userModel.find({usuario:usuario},(err,data) =>{
                        if(err){
                            return res.send({
                                status: 400,
                                msg: err
                            })
                        }
                        return res.send({
                            status: 200,
                            usuario: data[0].usuario,
                            name: data[0].nombre,
                            modoBot: data[0].modoBot,
                            imagen: data[0].imagen,
                            msg: "Datos actualizados"
                        })
                    })
                })
            })
        }
    }catch (e) {
        console.log(e);
        return res.send({
            status: 400,
            msg : e
        })
    }
}

const getUsuarios = async(req,res) =>{
    userModel.find({},{"contraseña":0},(err,data) =>{
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

function generateHash(username,secretHash,clientId){
    return crypto.createHmac('SHA256', secretHash)
        .update(username + clientId)
        .digest('base64')
}

module.exports = {
    login,
    register,
    updateUsuario,
    getUsuarios
}