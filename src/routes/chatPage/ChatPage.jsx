import React from 'react';
import { useEffect, useState, useRef } from "react";
import "./chatPage.css";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import ChatHistory from "../../components/chatHistory/ChatHistory";
import ChatInput from "../../components/chatInput/ChatInput";

const ChatPage = () => {
    const { userId, isLoaded } = useAuth();
    const navigate = useNavigate();
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoadingAnswerAPI, setIsLoadingAnswerAPI] = useState(false);

    const chatEndRef = useRef(null);

    useEffect(() => {
        if (isLoaded && !userId) {
            navigate("/sign-in");
        }
    }, [isLoaded, userId, navigate]);

    useEffect(() => {
        const fetchChatHistory = async () => {
            if (isLoaded && userId) {
                try {
                    const response = await fetch(`https://growbot-h6pr.onrender.com/api/history/${userId}`);
                    const history = await response.json();
                    
                    const formattedHistory = history.map(msg => ({
                        role: msg.role,
                        parts: [{ text: msg.content }]
                    }));
                    setChatHistory(formattedHistory);
                } catch (error) {
                    console.error("Erro ao buscar histórico do chat:", error);
                }
            }
        };

        fetchChatHistory();
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

    const getResponse = async () => {
        if (!value) {
            setError("Por favor, faça uma pergunta!");
            return;
        }

        setChatHistory(oldChatHistory => [...oldChatHistory, {
            role: "user",
            parts: [{ text: value }]
        }]);

        setIsLoadingAnswerAPI(true);
        const userMessage = value;
        setValue("");

        try {
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    userId, 
                    history: chatHistory, 
                    message: userMessage
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            const response = await fetch('https://growbot-h6pr.onrender.com/gemini', options);
            const data = await response.text();
            
            setChatHistory(oldChatHistory => [...oldChatHistory, {
                role: "model",
                parts: [{ text: data }]
            }]);
            
        } catch (error) {
            console.error(error);
            setError("Algo deu errado! Tente novamente mais tarde!");
        } finally {
            setIsLoadingAnswerAPI(false);
        }
    };

    const clear = () => {
        setValue("");
        setError("");
        setChatHistory([]);
    };

    return (
        <div className="chatPage">
            <ChatHistory chatHistory={chatHistory} chatEndRef={chatEndRef} isLoadingAnswerAPI={isLoadingAnswerAPI} />
            
            <ChatInput 
                value={value}
                setValue={setValue}
                error={error}
                getResponse={getResponse}
                clear={clear}
                surprise={surprise}
                isLoadingAnswerAPI={isLoadingAnswerAPI}
            />
        </div>
    );
};

export default ChatPage;