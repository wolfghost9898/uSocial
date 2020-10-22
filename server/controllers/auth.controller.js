const AWS = require('aws-sdk');
const config = require('../config')
const dateTime = require('node-datetime');
const userModel = require('../models/user.model');
const Bcrypt = require("bcryptjs");
const crypto = require('crypto')


const conitoIdentity = new AWS.CognitoIdentityServiceProvider({region:config.userPoolRegion})


const login = async (req, res) => {
    res.send("Hola Login")
}


const register = async (req, res) => {
    AWS.config.update(config.aws_remote_config)
    let { nombre, usuario, contra, imagen } = req.body.usuario
    contra = Bcrypt.hashSync(contra, 10)
    
    let date = dateTime.create();
    let formato = date.format('Y-m-d_H_M_S');
    let identificador = usuario + "_" + formato;
    imagen = (imagen.split('base64,'))[1]
    let bitmap = Buffer.from(imagen, 'base64')

    let newUser = userModel({
        nombre: nombre,
        usuario: usuario,
        contraseña: contra,
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
                Password: contra,
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

function generateHash(username,secretHash,clientId){
    return crypto.createHmac('SHA256', secretHash)
        .update(username + clientId)
        .digest('base64')
}

module.exports = {
    login,
    register
}