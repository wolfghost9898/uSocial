const AWS = require('aws-sdk');
const config = require('../config')
const dateTime = require('node-datetime');

const login = async(req,res) =>{
    res.send("Hola Login")
}


const register = async(req,res) =>{
    AWS.config.update(config.aws_remote_config)
    let {nombre,usuario,contraseña,imagen} = req.body
    let date = dateTime.create();
    let formato = date.format('Y-m-d_H_M_S');
    let identificador = usuario + "_" + formato;
    imagen = (imagen.split('base64,'))[1]
    let bitmap = Buffer.from(imagen,'base64')
    let s3 = new AWS.S3({
        accessKeyId : config.bucketID,
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
            return res.send("no")
        }
        return res.send("si")
    })
}


module.exports = {
    login,
    register
}