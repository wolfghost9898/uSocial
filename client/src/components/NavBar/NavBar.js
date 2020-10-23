import React, { Component } from 'react';
import Auth from '../../services/Auth'
import { Link, withRouter} from 'react-router-dom';

class NavBar extends Component {
    
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
        );
    }

}

export default withRouter(NavBar);