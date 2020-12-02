import React,{Component} from 'react';
import ImageUploader from 'react-images-upload';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import {url} from '../../config'
import axios from 'axios';
import Swal from 'sweetalert2'


class Register extends Component{

    constructor(){
        super()
        this.handleInputChange = this.handleInputChange.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.state = {
            nombre : '',
            usuario : '',
            contraseña : '',
            contraseñaC : '',
            pictures:[],
            errors:{
                contraseña : ''
            }

        }
        this.errors = this.state.errors
        
    }

    onDrop(picturesFiles,pictureDataURLs){
        this.setState({
            pictures:picturesFiles
        })
    }

    handleInputChange(e){
        let errors = this.state.errors
        let {id,value} = e.target
        if(id === 'nombre') this.setState({ nombre : value })
        else if(id === 'usuario') this.setState({ usuario : value })
        else if(id === 'contraseña' ) {
            if(this.state.contraseñaC.length > 0) errors.contraseña = (value !== this.state.contraseñaC) ? 'Las contraseñas no coinciden' : ''
            this.setState({ contraseña : value })
        }
        else if(id === 'contraseñaC') {
            errors.contraseña = (value !== this.state.contraseña) ? 'Las contraseñas no coinciden' : ''
            this.setState({contraseñaC : value})
        }
    }
    
    onSubmit = data =>{
        data.preventDefault()
        if(this.state.pictures.length > 0){
            let reader = new FileReader()
            reader.readAsDataURL(this.state.pictures[0])
            reader.onloadend = () =>{
                if(!(this.errors.contraseña.length > 0)){
                    
                    let usuario = {
                        nombre : this.state.nombre,
                        usuario : this.state.usuario,
                        contra: this.state.contraseña,
                        imagen: reader.result
                        
                    }
                    console.log(usuario)
                    axios.post(url.api + 'api/auth/register', { usuario })
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
                            title:'Usuario creado con exito',
                            icon: 'success'
                        })

                        this.setState = {
                            nombre : '',
                            usuario : '',
                            contraseña : '',
                            contraseñaC : '',
                            pictures:[],
                            errors:{
                                contraseña : ''
                            }
                
                        }
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
        }
        else alert("Suba una imagen antes")
        
    }

    render(){
        return(
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-7 mx-auto">
                        <div className="form-wrapper">
                            <div className="row">
                                <div className="col-md-12">
                                    <h4>Register Form</h4>
                                </div>
                            </div>
                            <form onSubmit={this.onSubmit} id="formulario">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <input type="text" id="nombre" value={this.state.name} onChange={this.handleInputChange} className="form-control" placeholder="Nombre Completo" autoComplete="off" required/>
                                        </div>
                                        <div className="form-group">
                                            <input type="text" id="usuario" value={this.state.usuario} onChange={this.handleInputChange} className="form-control" placeholder="Usuario" autoComplete="off" required/>
                                        </div>
                                        <div className="form-group">
                                            <input type="password" id="contraseña" value={this.state.contraseña} onChange={this.handleInputChange} className="form-control" placeholder="Contraseña" autoComplete="off" required/>
                                        </div>
                                        <div className="form-group">
                                            <input type="password" id="contraseñaC" value={this.state.contraseñaC} onChange={this.handleInputChange} className="form-control" placeholder="Confirmar Contraseña" autoComplete="off" required/>
                                        </div>
                                        <div className="form-group">
                                            {this.errors.contraseña.length > 0 && <span className="alert alert-danger">{this.errors.contraseña}</span>}
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
                                    <button className="btn btn-primary">Registrar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Register