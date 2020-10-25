import React, { Component } from 'react';
import './Style.css'
import Auth from '../../services/Auth'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios';
import { url } from '../../config'

class Chat extends Component {
    state = {
        amigos: []
    }
    constructor() {
        super()
        this.auth = new Auth()
        this.cerrarSesion = this.cerrarSesion.bind(this)
        this.enviarSolicitud = this.enviarSolicitud.bind(this)
        this.getData = this.getData.bind(this)
    }

    componentDidMount() {
        document.title = "Chat"
        this.getData()
    }

    cerrarSesion() {
        this.auth.cerrarSesion()
        this.props.history.push('/login')
    }

    getData() {
        let usuario = this.auth.obtenerInformacion()
        axios.get(url.api + 'api/amigo/getAmigos/' + usuario.usuario)
            .then(response => {
                let data = response.data
                if (data.status === 200) this.setState({ amigos: data.msg })
                console.log(data)
            })
            .catch(error => {
                console.log(error)
                this.setState({ amigos: [] })
            })
    }

    enviarSolicitud() {
        Swal.fire({
            title: 'Ingresar Usuario',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Enviar Solicitud',
            showLoaderOnConfirm: true,
            preConfirm: (receptor) => {
                let usuario = this.auth.obtenerInformacion()
                console.log(usuario)
                let datos = { emisor: usuario.usuario, receptor: receptor }
                return axios.post(url.api + 'api/amigo/enviar', { datos }).then(res => {
                    return res.data
                }).catch(error => {
                    return {
                        status: 400,
                        msg: error
                    }
                })
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                let data = result.value
                if (data.status === 400) {
                    console.log(result)
                    Swal.fire({
                        title: 'Error!',
                        text: data.msg,
                        icon: 'error',
                    })
                }
                else {
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
                                <Link className="nav-link" to="/Solicitudes">Solicitudes de Amistad</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={this.enviarSolicitud} href="#">Enviar Solicitud</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={this.cerrarSesion} >Salir</a>
                            </li>

                        </ul>
                    </div>

                </nav>
                <main role="main" className="flex-shrink-0 mt-5 main">
                    <div className="container-fluid py-md-4">
                        <div className="row">
                            {/* Lista de amigos*/}
                            <div className="col-md-2 col-sm-12 col-12">
                                <div className="list-group-flush">
                                    {this.state.amigos.map((amigo, i) => (
                                        <li className="list-group-item mb-2 rounded" key={i}>
                                            <span className="pull-left">
                                                <img src={amigo.imagen} className=" avatar img-fluid rounded imagen mr-2" />
                                            </span>
                                            <b>{amigo.nombre}</b>
                                        </li>
                                    ))}


                                </div>
                            </div>

                            {/* Chat Box*/}
                            <div className="col-md-10 col-sm-12 col-12">
                                <div className="jumbotron m-0 p-0 bg-transparent">
                                    <div className="row m-0 p-0 position-relative">
                                        <div className="col-12 p-0 m-0 position-absolute">
                                            {/*Header*/}
                                            <div className="card border-0 rounded cardBorder">
                                                <div className="card-header p-1 bg-light border border-top-0 border-left-0 border-right-0 cardHeader">
                                                    <h6 className="float-left title">
                                                        <b>Nombre</b><br></br>
                                                        <small>usuario</small>
                                                    </h6>
                                                </div>
                                            </div>
                                            {/*Cuerpo*/}
                                            <div className="card bg-sohbet border-0 m-0 p-0 cardBody">
                                                <div id="sohbet" className="card boder-0 m-0 p-0 position-relative bg-transparent chat">
                                                    <div className="balon1 p-2 m-0 position-relative" data-is="You - 3:20 pm">

                                                        <a className="float-right"> Hey there! What's up? </a>

                                                    </div>
                                                    <div className="balon2 p-2 m-0 position-relative" data-is="Yusuf - 3:22 pm">

                                                        <a className="float-left sohbet2"> Checking out iOS7 you know.. </a>

                                                    </div>
                                                </div>
                                            </div>
                                            {/*Footer*/}
                                            <div className="w-100 card-footer p-0 bg-light border border-bottom-0 border-left-0 border-right-0">
                                                <form className="m-0 p-0" autoComplete="off">
                                                    <div className="row m-0 p-0">
                                                        <div className="col-10 m-0 p-1">
                                                            <textarea rows="1" id="text" className="mw-100 border rounded form-control textMensaje" type="text" name="mensaje" placeholder="Type a messsage..." required/>
                                                        </div>
                                                        <div className="col-2 m-0 p-1">
                                                            <button className="btn btn-outline-secondary rounded boder w-100 boton" aria-multiline="true">Enviar</button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default Chat;