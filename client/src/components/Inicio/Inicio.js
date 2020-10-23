import React,{Component} from 'react';
import './Style.css'
import Auth from '../../services/Auth'
import { Link } from 'react-router-dom'

class Inicio extends Component{    
    constructor(){
        super()
        this.auth = new Auth()
        this.cerrarSesion = this.cerrarSesion.bind(this)
    } 

    cerrarSesion(){
        this.auth.cerrarSesion()
        this.props.history.push('/login')
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
                            <Link className="nav-link" to="/">Chat <span className="sr-only">(current)</span></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/Graficos">Publicar</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={this.cerrarSesion} >Salir</a>
                        </li>

                    </ul>
                </div>

            </nav>
                <main role="main" className="flex-shrink-0 mt-5 main">
                    <div className="container py-md-4">
                        Hola
                    </div>
                </main>
        </div>
        );
    }
}

export default Inicio;