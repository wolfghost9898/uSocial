import React,{Component} from 'react';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Style.css'
import Auth from '../../services/Auth'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { url } from '../../config'
import axios from 'axios';

class Usuarios extends Component{

    constructor(){
        super()
        this.auth = new Auth()
        this.cerrarSesion = this.cerrarSesion.bind(this)
        this.me = this.auth.obtenerInformacion()
        this.getUsuarios = this.getUsuarios.bind(this)   
        this.state = {
            usuarios: [],
            amigos: [],
            usuariosNoAmigos: []
        }
    } 

    componentDidMount() {
        this.getUsuarios()
    }

    cerrarSesion(){
        this.auth.cerrarSesion()
        this.props.history.push('/login')
    }

    getUsuarios(){
        let usuario = this.me
        this.state.usuariosNoAmigos = []
        axios.get(url.api + 'api/auth/getUsuarios')
        .then(response => {
            let data = response.data
            if (data.status === 200) {
                let usuarios = this.state.usuarios
                usuarios = usuarios.concat(data.msg)
                this.setState({ usuarios: usuarios })
            }
            axios.get(url.api + 'api/amigo/getAmigos/' + usuario.usuario)
            .then(response => {
                let data = response.data
                if (data.status === 200) {
                    let amigos = this.state.amigos
                    amigos = amigos.concat(data.msg)
                    this.setState({ amigos: amigos })

                    for(var i=0; i<this.state.usuarios.length; i++){
                        let estado = false;
                        for(var x=0; x<this.state.amigos.length; x++){
                            if(this.state.usuarios[i].usuario === this.state.amigos[x].usuario){
                                estado = true;
                            }
                        }
                        if(!estado){
                            if(this.state.usuarios[i].usuario != usuario.usuario){
                                let item = this.state.usuariosNoAmigos
                                item = item.concat(this.state.usuarios[i])
                                this.setState({ usuariosNoAmigos: item })
                            }
                        }
                    }
                    //console.log(this.state.usuariosNoAmigos)
                }
            })
            .catch(error => {
                console.log(error)
            })
        })
        .catch(error => {
            console.log(error)
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
                                <a className="nav-link" onClick={this.cerrarSesion} >Salir</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="container">
                    <div className="row mt-5">
                        <div className="col-md-6 mx-auto">
                            <div className="list-group-flush">
                                {this.state.usuariosNoAmigos.map((usuario, i) => ( 
                                    <li className="list-group-item mb-2 rounded" key={i}>
                                        <span className="pull-left">
                                            <img src={usuario.imagen} className=" avatar img-fluid rounded imagenUser mr-2" />
                                        </span>
                                        <b>User: {usuario.usuario}</b>
                                    </li>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Usuarios;