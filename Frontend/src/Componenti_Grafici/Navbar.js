import React, { useState, useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'
import LogoSenzaSfondo from '../Img/Logo_Senza_Sfondo.png'

const Navbar = () => {
    const [userName, setUserName] = useState("Accedi")
    const SERVER = process.env.REACT_APP_URL_SERVER

    useEffect(() => {
        impostaNomeUtente()
    }, [])

    const impostaNomeUtente =()=>{
        if(localStorage.rimaniLoggato === "true"){
            let UN = localStorage.method

            fetch(SERVER + 'imposta_nome_utente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ UN })
            })
            .then((response)=>{
                return response.json();
            })
            .then((data)=>{
                setUserName(data.nome_utente)
            })
        } else {
            setUserName("Accedi")
        }
    }
    
    return (
        <div className='row main-navbar'>
            <div className="col-2 d-flex justify-content-center">
                <NavLink to={'/'}>
                    <img src={LogoSenzaSfondo} alt="Logo ischool" className='resize-logo'/>
                </NavLink>
            </div>

            <div className="col-4 d-flex justify-content-center">
                <NavLink to={'/'} >
                    Corsi
                </NavLink>
            </div>

            <div className="col-3 d-flex justify-content-center">
                <NavLink to={'/Accedi'}>
                    {userName}
                </NavLink>
            </div>

            <div className="col-3 d-flex justify-content-center">
                <NavLink to={'/Messaggi'}>
                    Messaggi
                </NavLink>
            </div>
        </div>
    )
}

export default Navbar