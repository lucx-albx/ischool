import React,{useEffect} from 'react'
import './CardClassi.css'

const CardClassi = () => {
    const SERVER = process.env.REACT_APP_URL_SERVER
    
    useEffect(() => {
        carica_card_classi()
    }, [])
    
    const carica_card_classi =()=>{
        let nm_cr = localStorage.getItem("method")
        
        fetch(SERVER + 'carica_corsi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nm_cr })
        })
        .then((testo)=>testo.json())
        .then((data)=>{
            data.elementi.map((elem,i)=>{
                console.log(elem)
            })
        })
    }

    return (
        <div>CardClassi</div>
    )
}

export default CardClassi