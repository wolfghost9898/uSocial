import React from 'react';
import { Route, Redirect } from "react-router-dom";

const GuardedRoute = ({ component: Component, auth, ...rest }) => (
    
    <Route exact {...rest} render={(props) => (
        
        auth === true
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
)

export default GuardedRoute;