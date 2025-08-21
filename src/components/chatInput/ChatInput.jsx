import React from 'react'
import './chatInput.css';

const ChatInput = ({ value, setValue, error, getResponse, clear, surprise, isLoadingAnswerAPI }) => {
    return (
        <>
            <p className="question-surprise">
                O que mais você gostaria de saber?
                <button className="surprise" onClick={surprise} disabled={isLoadingAnswerAPI}>Surpreenda-me</button>
            </p>
            <div className="input-container">
                <input
                    value={value}
                    placeholder="O que é JavaScript?"
                    onChange={(e) => setValue(e.target.value)}
                    disabled={isLoadingAnswerAPI}
                />
                {!error && <button onClick={getResponse} disabled={isLoadingAnswerAPI}>Perguntar</button>}
                {error && <button onClick={clear}>Limpar</button>}
            </div>
            {isLoadingAnswerAPI && <p className="loading-message">Carregando...</p>}
            {error && <p>{error}</p>}
        </>
    );
};

export default ChatInput;