import React, { Component } from 'react';
import './Style.css'
import Auth from '../../services/Auth'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios';
import { url } from '../../config'
import socketIOClient from "socket.io-client";
import Bot from './Bot';
import Line from './Line'

class Chat extends Component {
    state = {
        amigos: [],
        nombre: "",
        usuario: "",
        mensajes: [],
        mensaje: ""
    }

    socket
    messagesEnd

    constructor() {
        super()
        this.auth = new Auth()
        this.cerrarSesion = this.cerrarSesion.bind(this)
        this.enviarSolicitud = this.enviarSolicitud.bind(this)
        this.escogerChat = this.escogerChat.bind(this)

        this.me = this.auth.obtenerInformacion()
        this.getData = this.getData.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)

        this.bot = new Bot();

        this.scrollToBottom = this.scrollToBottom.bind(this)



    }

    handleInputChange(e) {
        let { id, value } = e.target
        if (id === 'mensaje') this.setState({ mensaje: value })

    }

    onSubmit = data => {
        data.preventDefault();
        //Modo Bot
        if (this.state.usuario === "ChatBot") {
            let mensajes = this.state.mensajes
            mensajes.push({
                emisor: this.me.usuario,
                receptor: this.state.usuario,
                mensaje: this.state.mensaje,
            })

            this.bot.recibirMensaje(this.state.mensaje, function (respose) {
                mensajes.push({
                    emisor: this.state.usuario,
                    receptor: this.me.usuario,
                    mensaje: respose
                })
                this.setState({ mensajes: mensajes })
                this.setState({ mensaje: '' })


            }.bind(this))
        }
        //Modo Usuario
        else {
            axios.post(url.api + 'api/chat/enviar', { emisor: this.me.usuario, receptor: this.state.usuario, mensaje: this.state.mensaje })
                .then(res => {
                    console.log(res)
                    if (res.data.status === 200) {
                        let mensajes = this.state.mensajes
                        mensajes.push({
                            emisor: this.me.usuario,
                            receptor: this.state.usuario,
                            mensaje: this.state.mensaje
                        })
                        this.setState({ mensajes: mensajes })
                        this.setState({ mensaje: '' })

                    }

                })
                .catch(error => {
                    console.error(error)
                })
        }

        this.scrollToBottom()

    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        document.title = "Chat"
        this.getData()
    }

    componentWillUnmount() {
        if (this.socket) this.socket.disconnect()
    }

    cerrarSesion() {
        this.auth.cerrarSesion()
        this.props.history.push('/login')
    }

    getData() {
        let usuario = this.me
        this.setState({
            amigos: [{
                imagen: "https://pm1.narvii.com/7076/745e81cb77b6867c7ca66cacc655c46eb6df7237r1-1500-1203v2_hq.jpg",
                nombre: "ChatBot",
                usuario: "ChatBot"
            }]
        })
        axios.get(url.api + 'api/amigo/getAmigos/' + usuario.usuario)
            .then(response => {
                let data = response.data
                if (data.status === 200) {
                    let amigos = this.state.amigos
                    amigos = amigos.concat(data.msg)
                    this.setState({ amigos: amigos })
                }
                console.log(data)
            })
            .catch(error => {
                console.log(error)
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

    escogerChat(usuario) {
        this.state.nombre = usuario.nombre
        this.state.usuario = usuario.usuario
        console.log(usuario)
        console.log(this.state)
        if (this.socket) this.socket.disconnect()
        //Modo Bot
        if (usuario.nombre === "ChatBot") {
            let mensajes = []
            this.bot = new Bot()
            mensajes.push({
                emisor: usuario.usuario,
                receptor: this.me.usuario,
                mensaje: "Ingresa el comando !command"
            })
            this.setState({ mensajes: mensajes })
        }
        //Con usuarios
        else {
            this.socket = socketIOClient(url.api)
            axios.get(url.api + 'api/chat/conversacion/' + this.me.usuario + "/" + usuario.usuario)
                .then(response => {
                    let data = response.data
                    if (data.status === 200) this.setState({ mensajes: data.msg })
                    else this.setState({ amigos: [] })

                })
                .catch(error => {
                    console.log(error)
                    this.setState({ amigos: [] })
                })
            //console.log(this.me.usuario + '-' + usuario.usuario)
            this.socket.on(this.me.usuario + '-' + usuario.usuario, data => {
                let mensajes = this.state.mensajes
                mensajes.push({
                    emisor: usuario.usuario,
                    receptor: this.me.usuario,
                    mensaje: data
                })
                this.setState({ mensajes: mensajes })
                this.scrollToBottom()
            })
        }


        //console.log(usuario)
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
                                        <li className="list-group-item mb-2 rounded" key={i} onClick={() => this.escogerChat(amigo)}>
                                            <span className="pull-left">
                                                <img src={amigo.imagen} className=" avatar img-fluid rounded imagen mr-2" />
                                            </span>
                                            <b>{amigo.nombre}</b>
                                        </li>
                                    ))}


                                </div>
                            </div>

                            {/* Chat Box*/}
                            {this.state.nombre.length > 0 &&
                                <div className="col-md-10 col-sm-12 col-12">
                                    <div className="jumbotron m-0 p-0 bg-transparent">
                                        <div className="row m-0 p-0 position-relative">
                                            <div className="col-12 p-0 m-0 position-absolute">
                                                {/*Header*/}
                                                <div className="card border-0 rounded cardBorder">
                                                    <div className="card-header p-1 bg-light border border-top-0 border-left-0 border-right-0 cardHeader">
                                                        <h6 className="float-left title">
                                                            <b>{this.state.nombre}</b><br></br>
                                                            <small>{this.state.usuario}</small>
                                                        </h6>
                                                    </div>
                                                </div>
                                                {/*Cuerpo*/}
                                                <div className="card bg-sohbet border-0 m-0 p-0 cardBody" >
                                                    <div id="sohbet" className="card boder-0 m-0 p-0 position-relative bg-transparent chat" >

                                                        {this.state.mensajes.map((mensaje, i) => {
                                                            //console.log(i)
                                                            if (mensaje.emisor === this.me.usuario) {
                                                                return <div className="balon1 p-2 m-0 position-relative divMensaje" data-is="You" key={i} >
                                                                    <a className="float-right"> {mensaje.mensaje}</a>
                                                                </div>
                                                            }
                                                            else {
                                                                if (typeof mensaje.mensaje === "string") {
                                                                    return <div className="balon2 p-2 m-0 position-relative divMensaje" data-is={mensaje.emisor} key={i} >

                                                                        <a className="float-left"> {mensaje.mensaje} </a>

                                                                    </div>
                                                                }
                                                                return <div className="p-2 m-0 position-relative " data-is={mensaje.emisor} key={i} >

                                                                    <div className="float-left grafica"> <Line confirmados={mensaje.mensaje.confirmados} recuperados={mensaje.mensaje.recuperados} muertos={mensaje.mensaje.muertos} /> </div>
                                                                    
                                                                </div>

                                                            }


                                                        })}

                                                        <div className="balon1 p-2 m-0 position-relative divMensaje invisible"
                                                        > mensaje
                                                        </div>
                                                        <div className="balon2 p-2 m-0 position-relative divMensaje invisible"
                                                        >mensaje
                                                        </div>
                                                        <div className="balon1 p-2 m-0 position-relative divMensaje invisible"
                                                        >mensaje
                                                        </div>
                                                        <div className="balon2 p-2 m-0 position-relative divMensaje invisible"
                                                            ref={(el) => { this.messagesEnd = el; }}>mensaje
                                                        </div>

                                                    </div>

                                                </div>
                                                {/*Footer*/}
                                                <div className="w-100 card-footer p-0 bg-light border border-bottom-0 border-left-0 border-right-0">
                                                    <form className="m-0 p-0" autoComplete="off" onSubmit={this.onSubmit}>
                                                        <div className="row m-0 p-0">
                                                            <div className="col-10 m-0 p-1">
                                                                <textarea rows="1" id="mensaje" value={this.state.mensaje} onChange={this.handleInputChange} className="mw-100 border rounded form-control textMensaje" type="text" name="mensaje" placeholder="Type a messsage..." required />
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
                            }
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default Chat;