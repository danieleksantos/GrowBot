import { Link } from 'react-router-dom'
import './homepage.css'

const Homepage = () => {
    return (
        <div className='homepage'>
            <img src="/orbital.png" alt="orbital image" className='orbital'/>
            <div className="left">
                <h1>GrowBot</h1>
                <h2>Esclareça todas as suas dúvidas sobre o mercado tech</h2>
                <p>Por onde começo estudar? Quais são as fontes mais confiáveis? Onde encontro vagas? Como me preparar para entrevistas?...</p>
                <Link to="/dashboard">Confira tudo AQUI</Link>
            </div>

            <div className="right">
                <div className="imgContainer">
                    <div className="bgContainer">
                        <div className="bg"></div>
                    </div>
                    <img src="/bot.png" alt="Growbot" />
                </div>
            </div>
        </div>
    )
}

export default Homepage