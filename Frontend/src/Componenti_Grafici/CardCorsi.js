import React from 'react'
import './CardCorsi.css'

const CardCorsi = () => {

    const nascondi =()=>{
        document.querySelector(".sfondo-card-oscurato").classList.add("invisibile")
    }

    return (
        <div className='sfondo-card-oscurato invisibile'>
            <div className='mainCardCorsi'>
                <div onClick={nascondi}>X</div>
                <input type="text" placeholder='Titolo corso...' className='input-titolo-corso'/>

                <button>Crea</button>
            </div>
        </div>
    )
}

export default CardCorsi