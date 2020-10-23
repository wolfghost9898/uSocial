class Auth{

    constructor(){

    }

    iniciarSesion(nombre,usuario,imagen){
        localStorage.setItem('nombre',nombre);
        localStorage.setItem('usuario',usuario);
        localStorage.setItem('imagen',imagen)
    }


    sesionIniciada(){
        return !(localStorage.getItem("nombre") === null)
    }

    obtenerInformacion(){
        return {usuario:localStorage.getItem('usuario'),nombre: localStorage.getItem('nombre'),image: localStorage.getItem('imagen')}
    }


    cerrarSesion(){
        localStorage.clear();
    }

    saludar(){
        console.log("Hola")
    }

}


export default Auth