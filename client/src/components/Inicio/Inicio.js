import React,{Component} from 'react';
import './Style.css'
import NavBar from '../NavBar/NavBar'
import Auth from '../../services/Auth'

class Inicio extends Component{    
    constructor(){
        super()
        this.auth = new Auth()
        
    } 
    render() {
        return (
            <div>
                <NavBar/>
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