const AWS = require('aws-sdk');
const config = require('../config')
const dateTime = require('node-datetime');
const publicacionModel = require('../models/publicacion.model');
const userModel = require('../models/user.model');
const amigosModel = require('../models/amigos.model');

const addPublicacion = async (req, res) => {
    AWS.config.update(config.aws_remote_config)
    let { usuario, texto, imagen } = req.body.publicacion
    
    
    let date = dateTime.create();
    let formato = date.format('Y-m-d_H_M_S');
    let formato2 = date.format('Y/m/d-H:M:S');
    let identificador = "publicacion:"+ usuario + "_" + formato;
    imagen = (imagen.split('base64,'))[1]
    let bitmap = Buffer.from(imagen, 'base64')

    //console.log(newPublicacion)
    let s3 = new AWS.S3({
        region: 'us-east-2',
        accessKeyId: config.bucketID,
        secretAccessKey: config.bucketPassword
    })
    let params = {
        Bucket: config.bucketName + "/publicacion",
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

        //Obtener etiquetas 
        let rekognition = new AWS.Rekognition({
            region: 'us-east-2',
            accessKeyId: config.bucketID,
            secretAccessKey: config.bucketPassword
        })

        const params = {
            Image: {
                S3Object: {
                Bucket: config.bucketName,
                Name: "publicacion/" + identificador + ".png"
                },
            },
            MaxLabels: 1
        }
        var etiqueta = "";
        rekognition.detectLabels(params, function(err, response){
            if (err) {
                //console.log(err, err.stack); // an error occurred
                return res.send({
                    status: 400,
                    msg : err
                })
            } else {
                //console.log(response.Labels[0].Name)
                etiqueta = response.Labels[0].Name;
                let newPublicacion = publicacionModel({
                    usuario: usuario,
                    texto: texto,
                    date: formato2,
                    etiqueta: etiqueta,
                    imagen: config.buckerURL + "publicacion/" + identificador + ".png"
                })
        
                //Crear publicacion en BD      
                newPublicacion.save(err =>{
                    if(err){
                        return res.send({
                            status: 400,
                            msg : err
                        })
                    }
                    return res.send({
                        status: 200,
                        msg: "Publicacion creada con exito"
                    })
                })
            }
        })
    })
}

const getPublicaciones = async(req,res) =>{
    publicacionModel.find({},(err,data) =>{
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

const getPublicacionesEtiqueta = async(req,res) =>{
    let { etiqueta } = req.params
    publicacionModel.find({etiqueta: etiqueta},(err,data) =>{
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

const getTraduccionPublicacion = async(req,res) =>{
    let { texto } = req.params
    //console.log(texto)
    try{
        
        const translatedMsg = await getTranslation(texto)
        return res.send({
            status: 200,
            texto: translatedMsg.TranslatedText,
            message: "Traduccion correcta"
        })

    }catch (e) {
        console.log(e);
        return res.send({
            status: 400,
            msg : e
        })
    }
}

const getTranslation = async (msg) => {
    const translateService = new AWS.Translate({
        region: 'us-east-2',
        accessKeyId: config.bucketID,
        secretAccessKey: config.bucketPassword
    })

    const params = {
        Text: msg,
        SourceLanguageCode: "auto",
        TargetLanguageCode: "es"
    };

    const tranlatedMsg = await translateService.translateText(params, (err, data) => {
        //console.log(data)
        return data;
    }).promise()

    return tranlatedMsg
}


module.exports = {
    addPublicacion,
    getPublicaciones,
    getPublicacionesEtiqueta,
    getTraduccionPublicacion
}