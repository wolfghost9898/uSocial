import React, { Component, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, BrowserRouter, Redirect, Switch } from 'react-router-dom'

import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Inicio from './components/Inicio/Inicio'
import Chat from './components/Chat/Chat'
import GuardRoute from './Guards/GuardRoute'
import Auth from './services/Auth'
import Solicitudes from './components/Solicitudes/Solicitudes'
import Perfil from './components/Perfil/Perfil'
import CrearPublicacion from './components/Publicacion/CrearPublicacion';
import Usuarios from './components/Usuarios/Usuarios';

class App extends Component {


  constructor(){
    super()
    this.auth = new Auth()
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <GuardRoute  exact path="/" component={Inicio} auth={this.auth.sesionIniciada()} />
            <Route
              exact
              path="/register"
              component={Register}
            />
            <Route
              exact
              path="/login"
              component={Login}
            />

            <GuardRoute
              exact
              path="/chat"
              component={Chat} auth={this.auth.sesionIniciada()}
            />

            <GuardRoute
              exact
              path="/solicitudes"
              component={Solicitudes} auth={this.auth.sesionIniciada()}
            />

            <GuardRoute
              exact
              path="/perfil"
              component={Perfil} auth={this.auth.sesionIniciada()}
            />

            <GuardRoute
              exact
              path="/crearPublicacion"
              component={CrearPublicacion} auth={this.auth.sesionIniciada()}
            />

            <GuardRoute
              exact
              path="/usuarios"
              component={Usuarios} auth={this.auth.sesionIniciada()}
            />
            
            
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;