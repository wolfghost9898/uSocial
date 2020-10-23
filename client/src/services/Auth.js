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

    cerrarSesion(){
        localStorage.clear();
    }

    saludar(){
        console.log("Hola")
    }

}


export default Auth