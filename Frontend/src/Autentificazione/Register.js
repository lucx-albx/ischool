import React, { useState, useEffect } from 'react'
import './Register.css'
import { NavLink } from 'react-router-dom'
import Swal from 'sweetalert2'
import OTP from './Otp'

const Register = () => {
    const [ otpCode, setOtpCode ] = useState("")
    const [ verification, setVerification ] = useState({nome_utente: "", email: "", password: "", ruolo: ""}) 
    const SERVER = process.env.REACT_APP_URL_SERVER

    useEffect(() => {
        spunta_radio_studente()
    }, [])
    
    const Toast = Swal.mixin({
		toast: true,
		position: 'top',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', Swal.stopTimer)
			toast.addEventListener('mouseleave', Swal.resumeTimer)
		}
	})

    const spunta_radio_studente =()=>{
        document.querySelector(".radio-studente").checked = true
    }

    const registrati =async()=>{
        let main_register = document.querySelector(".main-register")
        let form_otp = document.querySelector(".main-otp")
        let nome_utente = document.querySelector(".register-nome-utente").value
        let email = document.querySelector(".register-email").value
        let password1 = document.querySelector(".register-password1").value
        let password2 = document.querySelector(".register-password2").value
        let radio_studente = document.querySelector(".radio-studente").checked
        let ruolo_selezionato = radio_studente === true ? "Studente" : "Docente"
        let esito = null

        if(await nome_utente_valido(nome_utente) === false) {
            Toast.fire({icon: 'error', title: '<strong>Attenzione!</strong> il nome utente deve essere più lungo di 4 caratteri e massimo 16 oppure è già in utilizzo'})
        } else if(await email_valida(email) === false){
            Toast.fire({icon: 'error', title: '<strong>Attenzione!</strong> email non valida oppure già in utilizzo'})
        } else if(password_valida(password1, password2) === false){
             Toast.fire({icon: 'error', title: '<strong>Attenzione!</strong> le password non coincidono e ricorda che deve essere lunga più di 7 caratteri'})
        } else {
            esito = await invia_email(email)
            
            if (esito[0] === false){
                Toast.fire({icon: 'error', title: esito[1]})
            } else {
                Toast.fire({icon: 'success', title: esito[1]})
            } 

            setVerification(
                {
                    nome_utente: nome_utente,
                    email: email,
                    password: password1,
                    ruolo: ruolo_selezionato
                }
            )

            main_register.classList.add("invisibile")
            form_otp.classList.remove("invisibile")
        }
    }

    const nome_utente_valido =async(nm)=>{
        if(nm.length > 3 && nm.length < 20){
            const response = await fetch(SERVER + 'controlla_che_nome_diverso', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nm })
            })
            const data = await response.json()
            return data.status
            
        } else {
            return false
        }
    }

    const email_valida =async(em)=>{
        if(em.length <= 35){
            const response = await fetch(SERVER + 'controlla_che_email_diversa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ em })
            })
            const data = await response.json()
            return data.status
        } else {
            return false
        }
    }

    const password_valida =(pw1, pw2)=>{
        if(pw1 !== pw2 || pw1.length < 8 && pw2.length < 8 && pw1.length < 30 && pw2.length < 30){
            return false
        } else {
            return true
        }
    }

    const invia_email =async(emailUtente)=>{
        const min = 1000
        const max = 9999

        let codice = Math.floor(Math.random() * (max - min + 1)) + min
        let oggetto = 'Ischool - verifica la tua email'
        let corpo = `<div style="background-color: #DA4432; padding: 20px; width: 600px; border: 3px solid hsla(0, 0%, 13%, 1); font-size: 18px; font-family: Arial, sans-serif;">
            <p style="text-align: center; font-size: 24px;"><strong>Benvenuto su Ischool</strong></p>
            <p>Gentile <strong>utente</strong>,</p>
            <p>Speriamo questa email ti trovi in buona salute. Desideriamo comunicarti il codice di verifica necessario per confermare la tua identità su Ischool. Questo passo aggiuntivo è fondamentale per garantire la sicurezza e la protezione del tuo account.</p>
            <p style="text-align: center; font-size: 28px; margin: 20px 0;"><strong>${codice}</strong></p>
            <p>Ti preghiamo di inserire questo codice nella schermata di verifica del sito Ischool per completare il processo.</p>
            <p>Cordialmente,<br/>Il Team di <strong>Ischool</strong></p>
            <p style="text-align: center; font-size: 14px; margin-top: 30px;">© 2023 Ischool. Tutti i diritti riservati.</p>
        </div>
        `

        setOtpCode(codice)

        const response = await fetch(SERVER + 'invia_verifica_email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emailUtente, oggetto, corpo  })
        })

        const data = await response.json()
        return [data.status, data.message]
    }

    return (
        <>
            <div className='main-register mt-120 mb-30'>
                <div className='col-5 data-type-login justify-content-center align-items-center'>
                    <strong>Registrati</strong>
                    <input type="text" placeholder='nome utente...' className='register-nome-utente'/>
                    <input type="text" placeholder='email...' className='register-email'/>
                    <input type="password" placeholder='password...' className='register-password1'/>
                    <input type="password" placeholder='reinserisci password...' className='register-password2'/>
                    <div>
                        <input type="radio" name="ruolo" value="Docente" className='radio-docente'/> Docente &nbsp;
                        <input type="radio" name="ruolo" value="Studente" className='radio-studente'/> Alunno
                    </div>
                    <input type="button" value="REGISTRATI" onClick={registrati}/>
                    <NavLink to={"/Accedi"}>Hai un account? Clicca qui per accedere!</NavLink>
                </div>
            </div>

            <OTP code={otpCode} dati={verification}/>
        </>
    )
}

export default Register