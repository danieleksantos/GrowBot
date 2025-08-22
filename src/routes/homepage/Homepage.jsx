import React from 'react'
import { Link } from 'react-router-dom'
import './homepage.css'

const Homepage = () => {
    return (
        <>
            <main className='homepage'>
                <img src="/orbital.png" alt="orbital image" className='orbital'/>
                <div className="left">
                    <h1>GrowBot</h1>
                    <h2>Esclareça todas as suas dúvidas sobre o mercado tech</h2>
                    <p>Por onde começo estudar? Quais são as fontes mais confiáveis? Onde encontro vagas? Como me preparar para entrevistas?...</p>
                    <Link to="/chat" className='link-action'>Confira tudo AQUI</Link>
                </div>

                <div className="right">
                    <div className="imgContainer">
                        <div className="bgContainer">
                            <div className="bg"></div>
                        </div>
                        <img src="/bot.png" alt="Growbot"  className='bot'/>
                    </div>
                </div>
                
            </main>
            <footer className="terms">
                <img src="/logo-blue.png" alt="logo GrowBot" />
                <p>Desenvolvido por Daniele Karina dos Santos</p>
            </footer>
        </>
        
    )
}

export default Homepage