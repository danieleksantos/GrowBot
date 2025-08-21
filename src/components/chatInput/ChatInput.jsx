import React from 'react'
import './chatInput.css';

const ChatInput = ({ 
    value, 
    setValue, 
    error, 
    getResponse, 
    clearChat, 
    clearFromDB,
    surprise, 
    isLoadingAnswerAPI,
    chatHistory
}) => {
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
                
                <button onClick={getResponse} disabled={isLoadingAnswerAPI}>Perguntar</button>
                
                {chatHistory && chatHistory.length > 0 && (
                    <>
                        <button onClick={clearChat}>Limpar Tela</button>
                        <button onClick={clearFromDB}>Apagar todo Histórico</button>
                    </>
                )}
            </div>
            {isLoadingAnswerAPI && <p className="loading-message">Carregando...</p>}
            {error && <p>{error}</p>}
        </>
    );
};

export default ChatInput;