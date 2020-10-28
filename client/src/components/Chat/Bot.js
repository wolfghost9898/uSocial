class Bot{
    estado = 0
    pais = ""
    fecha = ""
    constructor(){
        this.estado = 0
        this.pais = ""
        this.fecha = ""
    }

    recibirMensaje(mensaje){
        if(this.estado === 0) return this.comandos(mensaje)
        else if(this.estado === 1){
            this.pais = mensaje 
            this.estado = 2
            return "Buscare en el pais " + this.pais + "\nIngresa la fecha en formato AÑO-MES-DIA"
        }
        else if(this.estado === 2){
            this.estado = 3
            this.fecha = mensaje 
            return "Buscare en la Fecha " + this.fecha + "\nTipo de Caso(!confirmados,!recuperados,!muertos,!todos)"
        }
        else if(this.estado === 3){
            this.estado = 4
            mensaje = mensaje.toLowerCase()
            if(mensaje === "!confirmados"){
                return ""
            }
            else if(mensaje === "!recuperados"){
                return ""
            }
            else if(mensaje === "!muertos"){
                return ""
            }
            else if(mensaje === "!todos"){
                return ""
            }
            else{
                return ":( no reconozco el comando " + mensaje + "\nTipo de Caso(!confirmados,!recuperados,!muertos,!todos)"
            }
        }
    }

    comandos(mensaje){
        mensaje = mensaje.toLowerCase()
        if(mensaje === "!command") return "!casos -> obtener informacion de los casos de covid \n !grafica de casos -> obtener una grafica de los casos"
        if(mensaje === "!casos") {
            this.estado = 1
            return "¿Que pais deseas consultar?"
        }
        else return "No se reconoce el comando " + mensaje + ", ingresa el comando !command"
    }

    

}


export default Bot