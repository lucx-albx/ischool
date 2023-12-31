import React, { useState, useEffect } from 'react'
import './Corsi.css'
import CardCorsi from './Componenti_Grafici/CardCorsi'
import CardClassi from './Componenti_Grafici/CardClassi'

const Corsi = () => {
    const SERVER = process.env.REACT_APP_URL_SERVER
    const [permessi, setPermessi] = useState(false)
    const [titoliCorsi, setTitoliCorsi] = useState(null)

    useEffect(() => {
        ruolo_utente()
        carica_card_classi()
    }, [permessi, titoliCorsi])
    
    const ruolo_utente =()=>{
        let UN = localStorage.method
        
        fetch(SERVER + 'controlla_ruolo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ UN })
        })
        .then((testo)=>testo.json())
        .then((data)=>{
            setPermessi(data.status)
        })
    }

    const mostra_button_crea_corso =()=>{
        if (permessi === true){
            document.querySelector(".main-btn-crea-cosri").classList.remove("invisibile")

            return (<button onClick={crea_corso}>+</button>)
        }
    }

    const crea_corso =()=>{
        document.querySelector(".sfondo-card-oscurato").classList.remove("invisibile")
    }
    
    const carica_card_classi =()=>{
        let nm_cr = localStorage.getItem("method")
        let tit_tmp = []
        
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
                tit_tmp.push(elem)
            })

            setTitoliCorsi(tit_tmp)
        })
    }

    return (
        <div className='row mt-120 mb-30 mainCorsi'>
            <CardCorsi/>
            
            <div className='row container-corsi d-flex justify-content-center aling-items-center'>
                {
                    titoliCorsi ? titoliCorsi.map((elem, i) => {
                        return <CardClassi key={i} titolo={elem}/>
                    }) : null
                }
            </div> 

            <div className='col-12 d-flex justify-content-center aling-items-center main-btn-crea-cosri invisibile'>
                {mostra_button_crea_corso()}
            </div>
        </div>
    )
}

export default Corsi