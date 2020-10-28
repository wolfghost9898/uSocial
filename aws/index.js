'use strict'
const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser');
const app = express()
const axios = require('axios');
let url = "https://fherherand.github.io/covid-19-data-update/timeseries.json";



app.use(cors())
app.use(bodyParser.json({ limit: '70mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '70mb', parameterLimit: 70000 }));



app.use('/', function (req, res) {
    let { tipo, pais, fecha, atributo, fecha2 } = req.body
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

            return res.send({
                status: 200,
                msg: info
            })
        })
        .catch(function (error) {
            console.log(error)
            return res.send({
                status: 400,
                msg: error
            })
        })
})


const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('Server running on port ', PORT)
})

