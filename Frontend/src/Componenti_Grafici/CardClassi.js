import React from 'react'
import './CardClassi.css'

const CardClassi = (props) => {
    return (
        <div className='col-3 mainCardClassi'>
            {props.titolo}
        </div>
    )
}

export default CardClassi