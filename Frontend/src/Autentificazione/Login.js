import React from 'react'
import './Login.css'
import { NavLink, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const Login = () => {
    window.scrollTo(0, 0)

    const SERVER = process.env.REACT_APP_URL_SERVER
    const navigate = useNavigate()

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
    
    const Accedi =()=>{
        let email = document.querySelector(".login-email").value
        let password = document.querySelector(".login-password").value

        fetch(SERVER + 'accedi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then((testo)=>testo.json())
        .then((data)=>{
            if(data.status === true){
                Toast.fire({icon: 'success', title: data.message})

                localStorage.setItem("rimaniLoggato", "true")
                localStorage.setItem("method", data.nome_critto)

                setTimeout(function() {
                    navigate("/")
                    window.location.reload()
                }, 2000)
            } else {
                Toast.fire({icon: 'error', title: data.message})
            }
        })
    }

    return (
        <div className='main-login mt-120 mb-30'>
            <div className='col-5 data-type-login justify-content-center align-items-center'>
                <strong>Accedi</strong>
                <input type="text" placeholder='email...' className='login-email'/>
                <input type="password" placeholder='password...' className='login-password'/>
                <input type="button" value="ACCEDI" onClick={Accedi}/>
                <NavLink to={"/Registrati"}>Non hai un account? Clicca qui per registrarti!</NavLink>
            </div>
        </div>
    )
}

export default Login