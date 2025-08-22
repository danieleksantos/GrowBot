import React from 'react';
import { useEffect, useState, useRef } from "react";
import "./chatPage.css";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import ChatHistory from "../../components/chatHistory/ChatHistory";
import ChatInput from "../../components/chatInput/ChatInput";
import { getGeminiResponse, getChatHistoryFromDB, clearChatHistoryFromDB } from "../../services/api";

const ChatPage = () => {
    const { userId, isLoaded } = useAuth();
    const navigate = useNavigate();
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoadingAnswerAPI, setIsLoadingAnswerAPI] = useState(false);
    const [successMessage, setSuccessMessage] = useState(""); 

    const chatEndRef = useRef(null);

    useEffect(() => {
        if (isLoaded && !userId) {
            navigate("/sign-in");
        }
    }, [isLoaded, userId, navigate]);

    useEffect(() => {
        const loadChatHistory = async () => {
            if (isLoaded && userId) {
                try {
                    const history = await getChatHistoryFromDB(userId);
                    const formattedHistory = history.map(msg => ({
                        role: msg.role,
                        parts: [{ text: msg.content }]
                    }));
                    setChatHistory(formattedHistory);
                } catch (loadError) {
                    console.error("Erro ao buscar histórico do chat:", loadError);
                }
            }
        };
        loadChatHistory();
    }, [isLoaded, userId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    if (!isLoaded) return "Loading...";

    const surpriseOptions = [
        'Preciso fazer graduação para atuar como desenvolvedor?',
        'Qual é a média salarial de um dev júnior no Brasil?',
        'Qual a linguagem de programação mais utilizada no mundo?',
        'Quais são as principais diferenças entre as carreiras de front-end, back-end e full-stack?',
        'Devo focar em uma linguagem de programação específica ou aprender várias?',
        'Qual a importância de um portfólio para um desenvolvedor júnior?',
        'É melhor buscar um estágio, um programa de trainee ou uma vaga júnior diretamente?',
        'Devo investir em cursos online, bootcamps ou uma graduação formal?',
        'Como posso me manter atualizado com as novas tecnologias e tendências do mercado?'
    ];

    const surprise = () => {
        const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
        setValue(randomValue);
    };

    const clearError = () => {
        setError("");
    };

    const getResponse = async () => {
        if (!value) {
            setError("Por favor, faça uma pergunta!");
            return;
        }
        setSuccessMessage(""); 

        setChatHistory(oldChatHistory => [...oldChatHistory, {
            role: "user",
            parts: [{ text: value }]
        }]);

        setIsLoadingAnswerAPI(true);
        const userMessage = value;
        setValue("");

        try {
            const botResponse = await getGeminiResponse({ 
                userId, 
                history: chatHistory, 
                message: userMessage 
            });
            
            setChatHistory(oldChatHistory => [...oldChatHistory, {
                role: "model",
                parts: [{ text: botResponse }]
            }]);
            
        } catch (apiError) {
            console.error('Erro ao chamar a API do Gemini:', apiError); 
            setError("Ops! Algo deu errado! Tente novamente mais tarde!");
        } finally {
            setIsLoadingAnswerAPI(false);
        }
    };

    const clearChat = () => {
        setValue("");
        setError("");
        setChatHistory([]);
        setSuccessMessage(""); 
    };

    const clearFromDB = async () => {
        const isConfirmed = window.confirm("Tem certeza que deseja apagar o histórico de tudo que já conversamos?");
        if (!isConfirmed) {
            return; 
        }

        try {
            const success = await clearChatHistoryFromDB(userId);
            if (success) {
                clearChat();
                setSuccessMessage("Histórico apagado com sucesso!"); 
                console.log("Histórico local e no banco de dados limpo.");
            } else {
                setError("Falha ao apagar o histórico no servidor.");
            }
        } catch (error) {
            console.error(error);
            setError("Erro ao apagar o histórico. Verifique sua conexão.");
        }
    };

    return (
        <div className="chatPage">
            <ChatHistory chatHistory={chatHistory} chatEndRef={chatEndRef} isLoadingAnswerAPI={isLoadingAnswerAPI} />
            
            <ChatInput 
                value={value}
                setValue={setValue}
                error={error}
                getResponse={getResponse}
                clearError={clearError} 
                clearChat={clearChat}
                clearFromDB={clearFromDB}
                surprise={surprise}
                isLoadingAnswerAPI={isLoadingAnswerAPI}
                chatHistory={chatHistory}
            />
            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
    );
};

export default ChatPage;