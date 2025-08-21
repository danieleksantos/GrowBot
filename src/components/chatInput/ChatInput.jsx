import React, { useRef, useEffect } from 'react';
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
    const textareaRef = useRef(null);

    const handleResize = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; 
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        handleResize();
    }, [value]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!isLoadingAnswerAPI && value.trim() !== '') {
                getResponse();
            }
        }
    };

    return (
        <>
            <p className="question-surprise">
                O que mais você gostaria de saber?
                <a className="surprise" onClick={surprise} disabled={isLoadingAnswerAPI}>Surpreenda-me</a>
            </p>
            <div className="input-container">
                <textarea
                    ref={textareaRef}
                    rows="1"
                    value={value}
                    placeholder="O que é JavaScript?"
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoadingAnswerAPI}
                />
                
                <div className="button-group">
                    <button 
                        className='btn btn-ask' 
                        onClick={getResponse} 
                        disabled={isLoadingAnswerAPI}
                    >
                        Perguntar
                    </button>
                    
                    {chatHistory && chatHistory.length > 0 && (
                        <>
                            <button className='btn btn-clear-screen' onClick={clearChat}>Limpar Tela</button>
                            <button className='btn btn-clear-bd' onClick={clearFromDB}>Apagar todo Histórico</button>
                        </>
                    )}
                </div>
            </div>
            {isLoadingAnswerAPI && <p className="loading-message">Carregando...</p>}
            {error && <p>{error}</p>}
        </>
    );
};

export default ChatInput;