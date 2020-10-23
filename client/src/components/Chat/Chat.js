import React,{Component} from 'react';
import './Style.css'
import Auth from '../../services/Auth'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios';
import {url} from '../../config'

class Chat extends Component{    
    constructor(){
        super()
        this.auth = new Auth()

        this.cerrarSesion = this.cerrarSesion.bind(this)
        this.enviarSolicitud = this.enviarSolicitud.bind(this)
    } 

    cerrarSesion(){
        this.auth.cerrarSesion()
        this.props.history.push('/login')
    }

    enviarSolicitud(){
        Swal.fire({
            title: 'Ingresar Usuario',
            input:'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Enviar Solicitud',
            showLoaderOnConfirm: true,
            preConfirm:(receptor) =>{
                let usuario = this.auth.obtenerInformacion()
                console.log(usuario)
                let datos = {emisor:usuario.usuario,receptor:receptor}
                return axios.post(url.api + 'api/amigo/enviar',{datos}).then(res =>{
                    return res.data
                }).catch(error =>{
                    return {status:400,
                    msg: error}
                })
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) =>{
            if(result.isConfirmed){
                let data = result.value 
                if(data.status === 400){
                    console.log(result)
                    Swal.fire({
                        title: 'Error!',
                        text: data.msg,
                        icon: 'error',
                    })
                }
                else{
                    Swal.fire({
                        title: ':)',
                        text: data.msg,
                        icon: 'success',
                    })
                }
            }
        })
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/">Inicio <span className="sr-only">(current)</span></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/Graficos">Solicitudes de Amistad</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={this.enviarSolicitud}>Enviar Solicitud</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={this.cerrarSesion} >Salir</a>
                        </li>

                    </ul>
                </div>

            </nav>
                <main role="main" className="flex-shrink-0 mt-5 main">
                    <div className="container py-md-4">
                        <div className="row">
                            
                            <div className="col-md-4 col-sm-12 col-12">

                            </div>

                            <div className="col-md-8 col-sm-12 col-12">

                            </div>
                        </div>
                    </div>
                </main>
        </div>
        );
    }
}

export default Chat;