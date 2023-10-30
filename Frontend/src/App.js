import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Home'
import Navbar from './Componenti_Grafici/Navbar' 
import Footer from './Componenti_Grafici/Footer'
import Login from './Autentificazione/Login'
import Register from './Autentificazione/Register'
import Corsi from './Corsi'
import Impostazioni from './Impostazioni'
import Messaggi from './Messaggi'

const App = () => {
	const [home, setHome] = useState(<Home/>)
	const [accesso, setAccesso] = useState(<Login/>)
	const [registrati, setRegistrati] = useState(<Register/>)
	const [messaggi, setMessaggi] = useState(<Home/>)

	useEffect(() => {
		controlla_accesso()
	}, [])

	const controlla_accesso =()=>{
		if (localStorage.rimaniLoggato === "true"){
			setHome(<Corsi/>)
			setAccesso(<Impostazioni/>)
			setRegistrati(<Impostazioni/>)
			setMessaggi(<Messaggi/>)
		}
	}
	
	return (
		<div>
			<BrowserRouter>
                	<Navbar/>
					<Routes>
						<Route element={home} path={'/'} />
						<Route element={accesso} path={'/Accedi'} />
						<Route element={registrati} path={'/Registrati'} />
						<Route element={messaggi} path={'/Messaggi'} />
					</Routes>
					<Footer/>
         	</BrowserRouter>
		</div>
	)
}

export default App