import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, BrowserRouter, Redirect, Switch } from 'react-router-dom'

import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Inicio from './components/Inicio/Inicio'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
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
              path="/inicio"
              component={Inicio}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;