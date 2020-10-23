import React,{Component} from 'react';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import {url} from '../../config'
import axios from 'axios';
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'


class Login extends Component{

    constructor(){
        super()
        this.handleInputChange = this.handleInputChange.bind(this)
        this.state = {
            usuario : '',
            contraseña : '',
        }
    }

    handleInputChange(e){
        //let errors = this.state.errors
        let {id,value} = e.target
        if(id === 'usuario') this.setState({ usuario : value })
        else if(id === 'contraseña') this.setState({ contraseña : value })
    }
    
    onSubmit = data =>{
        data.preventDefault()
                    
        let usuario = {
            usuario : this.state.usuario,
            contra: this.state.contraseña,
        }
        console.log(usuario)
        axios.post(url.api + 'api/auth/login', { usuario })
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
                title:'Usuario valido',
                icon: 'success'
            })

            this.setState = {
                usuario : '',
                contraseña : '',
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
       
    render(){
        return(
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-7 mx-auto">
                        <div className="form-wrapper">
                            <div className="row">
                                <div className="col-md-12">
                                    <h4>Login</h4>
                                </div>
                            </div>
                            <form onSubmit={this.onSubmit} id="formulario">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <input type="text" id="usuario" value={this.state.usuario} onChange={this.handleInputChange} className="form-control" placeholder="Usuario" autoComplete="off" required/>
                                        </div>
                                        <div className="form-group">
                                            <input type="password" id="contraseña" value={this.state.contraseña} onChange={this.handleInputChange} className="form-control" placeholder="Contraseña" autoComplete="off" required/>
                                        </div>   
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <button className="btn btn-primary">Ingresar</button>
                                </div>
                                <div className="row mt-5">
                                    <Link to="/register">Registrarse</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Login