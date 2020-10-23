import React,{Component} from 'react';
import './Style.css'
import Auth from '../../services/Auth'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios';
import {url} from '../../config'

class Solicitudes extends Component{
    state = {
        solicitudes : []
    }    
    constructor(){
        super()
        this.auth = new Auth()
        this.cerrarSesion = this.cerrarSesion.bind(this)
        this.getData = this.getData.bind(this)
        this.aceptarSolicitud = this.aceptarSolicitud.bind(this)
        this.rechazarSolicitud = this.rechazarSolicitud.bind(this)
        this.quitarSolicitud = this.quitarSolicitud.bind(this)
    } 

    componentDidMount(){
        document.title = "Solicitudes"
        this.getData()
    }

    cerrarSesion(){
        this.auth.cerrarSesion()
        this.props.history.push('/login')
    }

    getData(){
        let usuario = this.auth.obtenerInformacion()
        axios.get(url.api +'api/amigo/getSolicitudes/' + usuario.usuario)
        .then(response =>{
            let data = response.data
            if(data.status === 200)  this.setState({solicitudes:data.msg})            
        })
        .catch(error =>{
            console.log(error)
            this.setState({solicitudes:[]})
        })
        
    }


    aceptarSolicitud(solicitud){
        let datos = {
            usuario1: solicitud.emisor,
            usuario2: solicitud.receptor
        }
        axios.post(url.api + 'api/amigo/add',{datos}).then(res =>{
            console.log(res)
            res = res.data
            if(res.status === 400){
                Swal.fire({
                    title: 'Error!',
                    text: res.msg,
                    icon: 'error',
                })
            }
            else{
                Swal.fire({
                    title: ':)',
                    text: "Usuario agregado con exito",
                    icon: 'success',
                })
                this.setState({solicitudes:this.quitarSolicitud(solicitud._id)})
            }
        }).catch(error =>{
            console.log(error)
            Swal.fire({
                title: 'Error!',
                text: error,
                icon: 'error',
            })
        })
        
    }

    rechazarSolicitud(solicitud){
        let datos = {
            usuario1: solicitud.emisor,
            usuario2: solicitud.receptor
        }
        axios.post(url.api + 'api/amigo/rechazar',{datos}).then(res =>{
            console.log(res)
            res = res.data
            if(res.status === 400){
                Swal.fire({
                    title: 'Error!',
                    text: res.msg,
                    icon: 'error',
                })
            }
            else{
                Swal.fire({
                    title: ':(',
                    text: "Solicitud Rechazada",
                    icon: 'success',
                })
                this.setState({solicitudes:this.quitarSolicitud(solicitud._id)})
            }
        }).catch(error =>{
            console.log(error)
            Swal.fire({
                title: 'Error!',
                text: error,
                icon: 'error',
            })
        })
    }

    quitarSolicitud(id){
        let data = this.state.solicitudes.filter((value) =>{
            return value._id !== id
        })
        return data
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
                            <Link className="nav-link" to="/chat">Chat <span className="sr-only">(current)</span></Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={this.cerrarSesion} >Salir</a>
                        </li>

                    </ul>
                </div>

            </nav>
                <main role="main" className="flex-shrink-0 mt-5 main">
                    <div className="container py-md-4">
                        {this.state.solicitudes.map((solicitud,i) =>(
                            <div className="card border-info mt-2 mb-2 bg-dark text-white" key={i}>
                                <div className="card-body">
                                    <p className="card-text">{solicitud.emisor}</p>
                                    <button type="button" onClick={() => this.aceptarSolicitud(solicitud)} className="btn btn-success mr-2">Aceptar</button>
                                    <button type="button" onClick={() => this.rechazarSolicitud(solicitud)} className="btn btn-danger">Rechazar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
        </div>
        );
    }
}

export default Solicitudes;