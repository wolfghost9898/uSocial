'use strict'
const PORT = process.env.PORT || 3000
const axios = require('axios');
let url = "https://fherherand.github.io/covid-19-data-update/timeseries.json";




module.exports.handler = (event, context, callback) => {
    let { tipo, pais, fecha, atributo, fecha2 } = event
    axios.get(url)
        .then(function (data) {
            data = data.data
            data = data[pais]
            let info = []
            if (tipo === 0) {
                data.forEach(element => {
                    if (element["date"] === fecha) {
                        if (atributo === "confirmados") info.push(element["confirmed"])
                        else if (atributo === "recuperados") info.push(element["recovered"])
                        else if (atributo === "muertos") info.push(element["deaths"])
                        else info.push(element)
                    }

                });
            }
            else {
                let date = new Date(fecha)
                let date2 = new Date(fecha2)
                data.forEach(element => {

                    let dateTemp = new Date(element["date"])
                    if (dateTemp >= date && dateTemp <= date2) info.push(element)


                });

            }

            let response =  {
                status: 200,
                msg: info
            }
            callback(null,response)
        })
        .catch(function (error) {
            console.log(error)
            let response =  {
                status: 400,
                msg: error
            }
            callback(null,response)
        })
}




