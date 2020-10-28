import React,{Component} from 'react';
import ImageUploader from 'react-images-upload';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Style.css'
import Auth from '../../services/Auth'
import { Link } from 'react-router-dom'
import {url} from '../../config'
import axios from 'axios';
import Swal from 'sweetalert2'

class Perfil extends Component{

    constructor(){
        super()
        this.auth = new Auth()
        this.cerrarSesion = this.cerrarSesion.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.me = this.auth.obtenerInformacion()
        this.state = {
            nombre : this.me.nombre,
            usuarioActual : this.me.usuario,
            usuario : this.me.usuario,
            contraseña : '',
            pictures:[],
        }
        this.statesModoBot = [ "On", "Off" ];
    }

    cerrarSesion(){
        this.auth.cerrarSesion()
        this.props.history.push('/login')
    }

    onDrop(picturesFiles,pictureDataURLs){
        this.setState({
            pictures:picturesFiles
        })
    }

    handleInputChange(e){
        let {id,value} = e.target
        if(id === 'nombre') this.setState({ nombre : value })
        else if(id === 'usuario') this.setState({ usuario : value })
        else if(id === 'contraseña') this.setState({ contraseña : value })
    }
    
    handleChange = (event) => {
        this.setState({
            value: event.target.value
        });
    }

    onSubmit = data =>{
        data.preventDefault() 
        if(this.state.pictures.length > 0){
            let reader = new FileReader()
            reader.readAsDataURL(this.state.pictures[0])
            reader.onloadend = () =>{
                let usuario = {
                    nombre : this.state.nombre,
                    usuario : this.state.usuario,
                    contra: this.state.contraseña,
                    imagen: reader.result
                }
                axios.put(url.api + 'api/auth/updateUsuario/' + this.state.usuarioActual , { usuario })
                .then(res => {
                    if(res.data.status === 400){
                        Swal.fire({
                            title: 'Error!',
                            text: res.data.msg,
                            icon: 'error',
                        })
                        return;
                    }

                    this.auth.iniciarSesion(res.data.name,res.data.usuario,res.data.imagen)
                    this.me = this.auth.obtenerInformacion()
                    this.setState({ usuarioActual : this.me.usuario })
                    this.setState({ contraseña : '' })
                    this.setState({ pictures : [] })

                    Swal.fire({
                        title:'Datos actualizados',
                        icon: 'success'
                    })
    
                    return;
                }).catch(error =>{
                    console.log(error.response)
                    Swal.fire({
                        title: 'Error!',
                        text: 'Ha ocurrido un error:(',
                        icon: 'error',
                    })
                })
            }
        }else{
            let usuario = {
                nombre : this.state.nombre,
                usuario : this.state.usuario,
                contra: this.state.contraseña,
                imagen: null
            }
            axios.put(url.api + 'api/auth/updateUsuario/' + this.state.usuarioActual , { usuario })
            .then(res => {
                if(res.data.status === 400){
                    Swal.fire({
                        title: 'Error!',
                        text: res.data.msg,
                        icon: 'error',
                    })
                    return;
                }

                this.auth.iniciarSesion(res.data.name,res.data.usuario,res.data.imagen)
                this.me = this.auth.obtenerInformacion()
                this.setState({ usuarioActual : this.me.usuario })
                this.setState({ contraseña : '' })

                Swal.fire({
                    title:'Datos actualizados',
                    icon: 'success'
                })

                return;
            }).catch(error =>{
                console.log(error.response)
                Swal.fire({
                    title: 'Error!',
                    text: 'Ha ocurrido un error:(',
                    icon: 'error',
                })
            })
        }
    }

    render(){
        return(
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
                    <div className="col-md-7 mx-auto">
                        <div className="form-wrapper">
                            <div className="row">
                                <div className="col-md-12">
                                    <h4>Perfil</h4>
                                </div>
                            </div>
                            <form onSubmit={this.onSubmit} id="formulario">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label>
                                                Nombre completo:
                                            </label>
                                            <input type="text" id="nombre" value={this.state.nombre} onChange={this.handleInputChange} className="form-control" autoComplete="off" required/>
                                        </div>
                                        <div className="form-group">
                                            <label>
                                                Usuario:
                                            </label>
                                            <input type="text" id="usuario" value={this.state.usuario} onChange={this.handleInputChange} className="form-control" autoComplete="off" required/>
                                        </div>
                                        <div className="form-group">
                                            <label>
                                                Foto:
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <span className="pull-left">
                                                <img className='profile-image' alt='icon' src={this.me.image} />
                                            </span>
                                        </div>
                                        <div className="form-group">
                                            <ImageUploader
                                                singleImage={true}
                                                withPreview={true}
                                                withIcon={true}
                                                buttonText='Subir Imagen'
                                                onChange={this.onDrop}
                                                imgExtension={['.jpg','.png']}
                                                maxFileSize={5242880}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>
                                                Confirmar contraseña:
                                            </label>
                                            <input type="password" id="contraseña" value={this.state.contraseña} onChange={this.handleInputChange} className="form-control" autoComplete="off" required/>
                                        </div>   
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <button className="btn btn-primary">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
        )
    }
}


export default Perfil