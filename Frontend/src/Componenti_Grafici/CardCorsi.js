import React from 'react'
import './CardCorsi.css'

const CardCorsi = () => {
    const SERVER = process.env.REACT_APP_URL_SERVER

    const nascondi =()=>{
        document.querySelector(".sfondo-card-oscurato").classList.add("invisibile")
    }

    const aggiungi_corso =()=>{
        let titolo_corso = document.querySelector(".input-titolo-corso").value
        let nm_cr = localStorage.getItem("method")
        let permessi = true

        fetch(SERVER + 'aggiungi_corso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titolo_corso, nm_cr, permessi })
        })
        .then((testo)=>testo.json())
        .then((data)=>{
            console.log(data.message)
        })
    }

    return (
        <div className='sfondo-card-oscurato invisibile'>
            <div className='mainCardCorsi'>
                <div onClick={nascondi}>X</div>
                <input type="text" placeholder='Titolo corso...' className='input-titolo-corso'/>

                <button onClick={aggiungi_corso}>Crea</button>
            </div>
        </div>
    )
}

export default CardCorsi