import React, { Component, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, BrowserRouter, Redirect, Switch } from 'react-router-dom'

import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Inicio from './components/Inicio/Inicio'
import Chat from './components/Chat/Chat'
import GuardRoute from './Guards/GuardRoute'
import Auth from './services/Auth'


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

            <Route
              exact
              path="/chat"
              component={Chat}
            />
            
            
            
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;