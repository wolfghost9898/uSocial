import React,{Component} from 'react';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Style.css'
import Auth from '../../services/Auth'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { url } from '../../config'
import axios from 'axios';

class Inicio extends Component{

    constructor(){
        super()
        this.auth = new Auth()
        this.cerrarSesion = this.cerrarSesion.bind(this)
        this.onDrop = this.onDrop.bind(this)  
        this.me = this.auth.obtenerInformacion()
        this.getPublicaciones = this.getPublicaciones.bind(this) 
        this.getPublicacionesEtiqueta = this.getPublicacionesEtiqueta.bind(this)  
        this.getEtiquetas = this.getEtiquetas.bind(this)   
        this.traducir = this.traducir.bind(this)  
        this.handleInputChange = this.handleInputChange.bind(this)
        this.state = {
            publicaciones: [],
            amigos: [],
            publicacionesAmigos: [],
            etiquetas: [],
            publicacionesEtiquetas: [],
            etiqueta: ""
        }
    } 

    componentDidMount() {
        this.getPublicaciones()
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

    getPublicaciones(){
        let usuario = this.me
        this.setState({ publicacionesAmigos: [] })
        this.setState({ publicaciones: [] })
        this.setState({ amigos: [] })


        axios.get(url.api + 'api/publicacion/getPublicaciones')
        .then(response => {
            let data = response.data
            if (data.status === 200) {
                let publicaciones = this.state.publicaciones
                publicaciones = publicaciones.concat(data.msg)
                this.setState({ publicaciones: publicaciones })
            }
            axios.get(url.api + 'api/amigo/getAmigos/' + usuario.usuario)
            .then(response => {
                let data = response.data
                if (data.status === 200) {
                    let amigos = this.state.amigos
                    amigos = amigos.concat(data.msg)
                    this.setState({ amigos: amigos })

                    for(var i=0; i<this.state.publicaciones.length; i++){
                        //console.log(this.state.publicaciones[i])

                        for(var x=0; x<this.state.amigos.length; x++){
                            if(this.state.publicaciones[i].usuario === this.state.amigos[x].usuario){
                                let item = {
                                    usuario : this.state.amigos[x].usuario,
                                    imagenUsuario: this.state.amigos[x].imagen,
                                    textoPublicacion: this.state.publicaciones[i].texto,
                                    etiqueta: this.state.publicaciones[i].etiqueta,
                                    imagenPublicacion: this.state.publicaciones[i].imagen,
                                    date: this.state.publicaciones[i].date
                                }
                                let itemm = this.state.publicacionesAmigos
                                itemm = itemm.concat(item)
                                this.setState({ publicacionesAmigos: itemm })
                            }
                        }
                        
                        
                        if(this.state.publicaciones[i].usuario === usuario.usuario){
                            let item = {
                                usuario : usuario.usuario,
                                imagenUsuario: usuario.image,
                                textoPublicacion: this.state.publicaciones[i].texto,
                                etiqueta: this.state.publicaciones[i].etiqueta,
                                imagenPublicacion: this.state.publicaciones[i].imagen,
                                date: this.state.publicaciones[i].date
                            }
                            let itemm = this.state.publicacionesAmigos
                            itemm = itemm.concat(item)
                            this.setState({ publicacionesAmigos: itemm })
                            //console.log(this.state.publicacionesAmigos)
                        }
                    }
                    //console.log(this.state.publicacionesAmigos)
                    const reversed = this.state.publicacionesAmigos.reverse();
                    this.setState({ publicacionesAmigos: reversed })
                    //console.log(this.state.publicacionesAmigos)

                    //------------Etiqueta-----------
                    this.getEtiquetas(this.state.publicacionesAmigos)

                    
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

    getPublicacionesEtiqueta(etiqueta){
        let usuario = this.me
        this.setState({ publicacionesAmigos: [] })
        this.setState({ publicaciones: [] })
        this.setState({ amigos: [] })
        axios.get(url.api + 'api/publicacion/getPublicacionesEtiqueta/'+etiqueta)
        .then(response => {
            let data = response.data
            if (data.status === 200) {
                let publicaciones = this.state.publicaciones
                publicaciones = publicaciones.concat(data.msg)
                this.setState({ publicaciones: publicaciones })
            }
            axios.get(url.api + 'api/amigo/getAmigos/' + usuario.usuario)
            .then(response => {
                let data = response.data
                if (data.status === 200) {
                    let amigos = this.state.amigos
                    amigos = amigos.concat(data.msg)
                    this.setState({ amigos: amigos })

                    for(var i=0; i<this.state.publicaciones.length; i++){
                        //console.log(this.state.publicaciones[i])

                        for(var x=0; x<this.state.amigos.length; x++){
                            if(this.state.publicaciones[i].usuario === this.state.amigos[x].usuario){
                                let item = {
                                    usuario : this.state.amigos[x].usuario,
                                    imagenUsuario: this.state.amigos[x].imagen,
                                    textoPublicacion: this.state.publicaciones[i].texto,
                                    imagenPublicacion: this.state.publicaciones[i].imagen,
                                    date: this.state.publicaciones[i].date
                                }
                                let itemm = this.state.publicacionesAmigos
                                itemm = itemm.concat(item)
                                this.setState({ publicacionesAmigos: itemm })
                            }
                        }
                        
                        
                        if(this.state.publicaciones[i].usuario === usuario.usuario){
                            let item = {
                                usuario : usuario.usuario,
                                imagenUsuario: usuario.image,
                                textoPublicacion: this.state.publicaciones[i].texto,
                                imagenPublicacion: this.state.publicaciones[i].imagen,
                                date: this.state.publicaciones[i].date
                            }
                            let itemm = this.state.publicacionesAmigos
                            itemm = itemm.concat(item)
                            this.setState({ publicacionesAmigos: itemm })
                            //console.log(this.state.publicacionesAmigos)
                        }
                    }
                    //console.log(this.state.publicacionesAmigos)
                    const reversed = this.state.publicacionesAmigos.reverse();
                    this.setState({ publicacionesAmigos: reversed })
                    //console.log(this.state.publicacionesAmigos)
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

    getEtiquetas(publicacionesAmigos){
        let etiquetas = this.state.etiquetas
        let etiqueta = {
            nombre: 'Filtrar Publicaciones'
        }
        etiquetas = etiquetas.concat(etiqueta)
        this.setState({ etiquetas: etiquetas })
        etiquetas = this.state.etiquetas
        etiqueta = {
            nombre: 'Todos'
        }
        etiquetas = etiquetas.concat(etiqueta)
        this.setState({ etiquetas: etiquetas })
        for(var i=0; i<publicacionesAmigos.length; i++){
            //console.log(publicacionesAmigos[i].etiqueta)
            let etiquetas = this.state.etiquetas
            let etiqueta = {
                nombre: publicacionesAmigos[i].etiqueta
            }
            etiquetas = etiquetas.concat(etiqueta)
            this.setState({ etiquetas: etiquetas })
        }
        let set = new Set( this.state.etiquetas.map( JSON.stringify ) )
        let arrSinDuplicaciones = Array.from( set ).map( JSON.parse );
        this.setState({ etiquetas: arrSinDuplicaciones })
    }

    traducir(textoPublicacion){
        let texto = textoPublicacion;
        //console.log(texto)
        axios.get(url.api + 'api/publicacion/getTraduccion/'+ texto)
        .then(response => {
            let data = response.data
            if (data.status === 200) {
                //console.log(data.texto)
                Swal.fire({
                    title:'Traducción:',
                    text: data.texto 
                })
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    handleInputChange(e){
        let {id,value} = e.target
        if(id === 'etiqueta'){
            //console.log(value)
            if(value === "Filtrar Publicaciones"){
                
            }else if(value === "Todos"){
                this.getPublicaciones()
            }else{
                this.getPublicacionesEtiqueta(value)
            }
        }
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
                                <Link className="nav-link" to="/Usuarios">Usuarios</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/CrearPublicacion">Publicar</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Perfil">Mi perfil</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={this.cerrarSesion} >Salir</a>
                            </li>
                        </ul>
                    </div>
                </nav>
               
                <div className="container">
                    <div className="row mt-5">
                        {/* Lista de publicaciones*/}
                        <div className="col-md-7 mx-auto">
                            <div className="row mt-5">
                                <div className="content-select">
                                    <select id="etiqueta" onChange={this.handleInputChange}>
                                        {this.state.etiquetas.map((etiqueta, i) => ( 
                                            <option value={etiqueta.nombre} key={i}>{etiqueta.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <br></br>
                            <div className="list-group-flush">
                                {this.state.publicacionesAmigos.map((publicacion, i) => ( 
                                    <li className="list-group-item mb-2 rounded" key={i}>
                                        <span className="pull-left">
                                            <img src={publicacion.imagenUsuario} className=" avatar img-fluid rounded imagen mr-2" />
                                        </span>
                                        <b>{publicacion.usuario}</b>
                                        <hr></hr>
                                        <p>{publicacion.textoPublicacion}</p>  
                                        <div className="center">
                                            <img className='profile-image img-fluid' alt='icon' src={publicacion.imagenPublicacion}/>
                                        </div>
                                        <br></br>
                                        <a href="#" onClick={this.traducir.bind(this,publicacion.textoPublicacion)}>
                                        Traducir
                                        </a>
                                        <br></br>
                                        <label>{publicacion.date}</label>
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

export default Inicio;