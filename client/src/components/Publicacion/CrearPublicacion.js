import React,{Component} from 'react';
import ImageUploader from 'react-images-upload';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Style.css'
import Auth from '../../services/Auth'
import { Link } from 'react-router-dom'
import {url} from '../../config'
import axios from 'axios';
import Swal from 'sweetalert2'

class CrearPublicacion extends Component{

    constructor(){
        super()
        this.auth = new Auth()
        this.handleInputChange = this.handleInputChange.bind(this)
        this.cerrarSesion = this.cerrarSesion.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.me = this.auth.obtenerInformacion()
        this.state = {
            usuario : this.me.usuario,
            textoPublicacion : '',
            pictures:[],
        }
    }

    componentDidMount() {
        document.title = "CrearPublicacion"
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
        if(id === 'textoPublicacion') this.setState({ textoPublicacion : value })
    }

    onSubmit = data =>{
        data.preventDefault() 
        if(this.state.pictures.length > 0){
            let reader = new FileReader()
            reader.readAsDataURL(this.state.pictures[0])
            reader.onloadend = () =>{
                let publicacion = {
                    usuario : this.state.usuario,
                    texto : this.state.textoPublicacion,
                    imagen: reader.result
                    
                }
                
                axios.post(url.api + 'api/publicacion/addPublicacion', { publicacion })
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    if(res.data.status === 400){
                        Swal.fire({
                            title: 'Error!',
                            text: res.data.msg,
                            icon: 'error',
                        })
                        return;
                    }
                    Swal.fire({
                        title:'Publicación creada con exito',
                        icon: 'success'
                    })
                    this.props.history.push('/')
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
        else alert("Suba una imagen antes")
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
                                    <h4>Publicación</h4>
                                </div>
                            </div>
                            <form onSubmit={this.onSubmit} id="formulario">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <input type="text" id="textoPublicacion" value={this.state.textoPublicacion} onChange={this.handleInputChange} className="form-control" placeholder="This is a new post" autoComplete="off"/>
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
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <button className="btn btn-primary">Publicar</button>
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


export default CrearPublicacion