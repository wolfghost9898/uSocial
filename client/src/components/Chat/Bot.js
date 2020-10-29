import axios from 'axios';
class Bot {
    url = "https://a2iud0d1dk.execute-api.us-east-2.amazonaws.com/test"
    estado = 0
    pais = ""
    fecha = ""
    fecha2 = ""
    constructor() {
        this.estado = 0
        this.pais = ""
        this.fecha = ""
        this.fecha2 = ""
    }

    recibirMensaje(mensaje, callback) {
        if (this.estado === 0) callback(this.comandos(mensaje))
        else if (this.estado === 1) {
            this.pais = mensaje
            this.estado = 2
            callback("Buscare en el pais " + this.pais + "\nIngresa la fecha en formato AÑO-MES-DIA")
        }
        else if (this.estado === 2) {
            this.estado = 3
            this.fecha = mensaje
            callback("Buscare en la Fecha " + this.fecha + "\nTipo de Caso(!confirmados,!recuperados,!muertos,!todos)")
        }
        else if (this.estado === 3) {
            mensaje = mensaje.toLowerCase()
            if (mensaje === "!confirmados") {
                axios.post(this.url, { tipo: 0, pais: this.pais, fecha: this.fecha, fecha2: this.fecha2, atributo: "confirmados" })
                    .then(res => {
                        console.log(res)
                        this.estado = 0
                        if (res.data.status === 200) callback(res.data.msg[0] + " casos confirmados, en " + this.pais + " el dia: " + this.fecha)
                        else callback("No se encontro informacion del pais " + this.pais + " en la fecha: " + this.fecha)

                    })
                    .catch(error => {
                        console.error(error)
                        this.estado = 0
                        callback("No se encontro informacion del pais " + this.pais + " en la fecha: " + this.fecha)
                    })

            }
            else if (mensaje === "!recuperados") {
                axios.post(this.url, { tipo: 0, pais: this.pais, fecha: this.fecha, fecha2: this.fecha2, atributo: "recuperados" })
                    .then(res => {
                        console.log(res)
                        this.estado = 0
                        if (res.data.status === 200) callback(res.data.msg[0] + " casos recuperados, en " + this.pais + " el dia: " + this.fecha)
                        else callback("No se encontro informacion del pais " + this.pais + " en la fecha: " + this.fecha)

                    })
                    .catch(error => {
                        console.error(error)
                        this.estado = 0
                        callback("No se encontro informacion del pais " + this.pais + " en la fecha: " + this.fecha)
                    })
            }
            else if (mensaje === "!muertos") {
                axios.post(this.url, { tipo: 0, pais: this.pais, fecha: this.fecha, fecha2: this.fecha2, atributo: "muertos" })
                    .then(res => {
                        console.log(res)
                        this.estado = 0
                        if (res.data.status === 200) callback(res.data.msg[0] + " muertes, en " + this.pais + " el dia: " + this.fecha)
                        else callback("No se encontro informacion del pais " + this.pais + " en la fecha: " + this.fecha)

                    })
                    .catch(error => {
                        console.error(error)
                        this.estado = 0
                        callback("No se encontro informacion del pais " + this.pais + " en la fecha: " + this.fecha)
                    })
            }
            else if (mensaje === "!todos") {
                axios.post(this.url, { tipo: 0, pais: this.pais, fecha: this.fecha, fecha2: this.fecha2, atributo: "todos" })
                    .then(res => {
                        console.log(res)
                        this.estado = 0
                        if (res.data.status === 200) callback(res.data.msg[0].confirmed + " casos confirmados, " + res.data.msg[0].recovered + " casos recuperados, "
                            + res.data.msg[0].deaths + " muertes, en " + this.pais + " en la fecha " + this.fecha)
                        else callback("No se encontro informacion del pais " + this.pais + " en la fecha: " + this.fecha)

                    })
                    .catch(error => {
                        console.error(error)
                        this.estado = 0
                        callback("No se encontro informacion del pais " + this.pais + " en la fecha: " + this.fecha)
                    })
            }
            else {
                callback(":( no reconozco el comando " + mensaje + "\nTipo de Caso(!confirmados,!recuperados,!muertos,!todos)")
            }
        }
        else if (this.estado === 4) {
            this.pais = mensaje
            this.estado = 5
            callback("Buscare en el pais " + this.pais + "\nIngresa la fecha de Inicio en formato AÑO-MES-DIA")
        }
        else if (this.estado === 5) {
            this.estado = 6
            this.fecha = mensaje
            callback("Buscare en la Fecha " + this.fecha + "\nIngresa la fecha de Fin en formato AÑO-MES-DIA")
        }
        else if (this.estado === 6) {
            this.fecha2 = mensaje
            axios.post(this.url, { tipo: 1, pais: this.pais, fecha: this.fecha, fecha2: this.fecha2, atributo: "confirmados" })
                .then(res => {
                    console.log(res)
                    this.estado = 0
                    if (res.data.status === 200) {
                        let response = {
                            confirmados: [],
                            recuperados: [],
                            muertos: []
                        }
                        res.data.msg.forEach(caso => {
                            response.confirmados.push({ x: new Date(caso.date), y: caso.confirmed })
                            response.recuperados.push({ x: new Date(caso.date), y: caso.recovered })
                            response.muertos.push({ x: new Date(caso.date), y: caso.deaths })

                        });
                        callback(response)

                    }
                    else callback("No se encontro informacion del pais " + this.pais + " en la fecha Inicio: " + this.fecha + "en la fecha Fin: " + this.fecha2)

                })
                .catch(error => {
                    console.error(error)
                    this.estado = 0
                    callback("No se encontro informacion del pais " + this.pais + " en la fecha Inicio: " + this.fecha + "en la fecha Fin: " + this.fecha2)
                })
        }
    }

    comandos(mensaje) {
        mensaje = mensaje.toLowerCase()
        if (mensaje === "!command") return "!casos -> obtener informacion de los casos de covid \n !grafica de casos -> obtener una grafica de los casos"
        else if (mensaje === "!casos") {
            this.estado = 1
            return "¿Que pais deseas consultar? (Primera letra en mayuscula)"
        }
        else if (mensaje === "!grafica de casos") {
            this.estado = 4
            return "¿Que pais deseas consultar? (Primera letra en mayuscula)"
        }
        else return "No se reconoce el comando " + mensaje + ", ingresa el comando !command"
    }



}


export default Bot