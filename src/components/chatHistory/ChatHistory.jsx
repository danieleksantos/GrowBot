import React from 'react'
import ReactMarkdown from "react-markdown";
import './chatHistory.css';

const ChatHistory = ({ chatHistory, chatEndRef, isLoadingAnswerAPI }) => {
    return (
        <div className="search-result">
            {chatHistory.map((chatItem, _index) => (
                <div key={_index}>
                    <div className="wrapper">
                        <div className={`answer ${chatItem.role === 'user' ? 'user-message' : 'bot-message'}`}>
                            <strong>{chatItem.role === 'user' ? 'Você' : 'GrowBot'}:</strong>
                            <ReactMarkdown>
                                {(chatItem.parts && chatItem.parts.length > 0) ? chatItem.parts[0].text : 'Resposta vazia'}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            ))}
            
            {isLoadingAnswerAPI && (
                <div className="wrapper">
                    <div className="bot-message">
                        <strong>GrowBot:</strong>
                        <p>Digitando...</p>
                    </div>
                </div>
            )}
            
            <div ref={chatEndRef} />
        </div>
    );
};

export default ChatHistory;