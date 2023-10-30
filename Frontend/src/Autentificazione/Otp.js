import React, { useState } from 'react'
import './Otp.css'
import Swal from 'sweetalert2'

const Otp = (props) => {
    const nome_utente = props.dati.nome_utente
    const email = props.dati.email
    const password = props.dati.password
    const ruolo = props.dati.ruolo
    const [ opt, setOpt ] = useState("")
    const SERVER = process.env.REACT_APP_URL_SERVER

    const Toast = Swal.mixin({
		toast: true,
		position: 'top',
		showConfirmButton: false,
		timer: 2000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', Swal.stopTimer)
			toast.addEventListener('mouseleave', Swal.resumeTimer)
		}
	})

    const verificaOpt =()=>{
        let opt_inserito = document.querySelector(".form-card-input").value

        if(parseInt(opt_inserito) === props.code || parseInt(opt_inserito) === opt){
            fetch(SERVER + 'registrati', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome_utente, email, password, ruolo })
            })
            .then((testo)=>testo.json())
            .then((data)=>{
                if(data.status === false){
                    Toast.fire({icon: 'success', title: data.message})

                    localStorage.setItem("rimaniLoggato", "true")
                    localStorage.setItem("method", data.nome_critto)

                    setTimeout(function() {
                        window.location.reload()
                    }, 2000)
                } else {
                    Toast.fire({icon: 'error', title: data.message})
                }
            })
        } else {
            Toast.fire({icon: 'error', title: '<strong>Attenzione!</strong> il codice che hai inserito non è corretto'})
        }
    }

    const invia_email =async(emailUtente)=>{
        setTimeout(async function() {
            const min = 1000
            const max = 9999

            let codice = Math.floor(Math.random() * (max - min + 1)) + min
            let oggetto = 'Pokemon house - verifica la tua email'
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

            setOpt(codice)

            const response = await fetch(SERVER + 'invia_verifica_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ emailUtente, oggetto, corpo  })
            })

            const data = await response.json()

            if (data.status === true){
                Toast.fire({icon: 'success', title: data.message})
            } else {
                Toast.fire({icon: 'error', title: data.message})
            }
        }, 5000)
    }

    return (
        <div className='main-otp mt-120 mb-30 invisibile'>
            <form className="form-card otp-form">
                <p className="form-card-title">Ti abbiamo inviato una email</p>
                <p className="form-card-prompt">Inserisci il numero che ti abbiamo inviato via email per verificare che sia veramente tu</p>
                
                <div className="form-card-input-wrapper">
                    <input className="form-card-input" placeholder="____" maxLength="4" />
                    <div className="form-card-input-bg"></div>
                </div>

                <div className='submit d-flex justify-content-center align-items-center' onClick={verificaOpt}>
                    <div>Verifica</div>
                </div>

                <p className="call-again"><span className="underlined" onClick={()=>invia_email(email)}>invia</span> di nuovo</p>
            </form>
        </div>
    )
}

export default Otp