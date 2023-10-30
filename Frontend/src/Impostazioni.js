import React from 'react'
import './Impostazioni.css'

const Impostazioni = () => {

    const disconnetti =()=>{
        localStorage.setItem("rimaniLoggato", "false")
        window.location.reload()
    }

    return (
        <div className='row mt-120 mb-30 justify-content-center'>
            <button onClick={disconnetti}>DISCONNETTITI</button>
        </div>
    )
}

export default Impostazioni