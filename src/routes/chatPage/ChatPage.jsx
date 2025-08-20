import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import "./chatPage.css";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
    const { userId, isLoaded } = useAuth();
    const navigate = useNavigate();
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [chatHistory, setChatHistory] = useState([]);

    const chatEndRef = useRef(null);

    useEffect(() => {
        if (isLoaded && !userId) {
            navigate("/sign-in");
        }
    }, [isLoaded, userId, navigate]);

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
        try {
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    history: chatHistory,
                    message: value
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const response = await fetch('http://localhost:8000/gemini', options);
            const data = await response.text();
            setChatHistory(oldChatHistory => [...oldChatHistory, {
                role: "user",
                parts: [{ text: value }]
            },
            {
                role: "model",
                parts: [{ text: data }]
            }
            ]);
            setValue("");
        } catch (error) {
            console.error(error);
            setError("Algo deu errado! Tente novamente mais tarde!");
        }
    };

    const clear = () => {
        setValue("");
        setError("");
        setChatHistory([]);
    };

    return (
        <div className="chatPage">
            <div className="search-result">
                {chatHistory.map((chatItem, _index) => (
                    <div key={_index}>
                        <div className="wrapper">
                            <div ref={chatEndRef} />
                            <div className={`answer ${chatItem.role === 'user' ? 'user-message' : 'bot-message'}`}> 
                                <strong>{chatItem.role === 'user' ? 'Você' : 'GrowBot'}:</strong>
                                <ReactMarkdown>
                                    {(chatItem.parts && chatItem.parts.length > 0) ? chatItem.parts[0].text : 'Resposta vazia'}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}       
            </div>
            
            <p className="question-surprise">
                O que mais você gostaria de saber?
                <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surpreenda-me</button>
            </p>
            <div className="input-container">
                <input
                    value={value}
                    placeholder="O que é JavaScript?"
                    onChange={(e) => setValue(e.target.value)}
                />
                {!error && <button onClick={getResponse}>Perguntar</button>}
                {error && <button onClick={clear}>Limpar</button>}
            </div>
            {error && <p>{error}</p>}
        </div>
    );
};

export default ChatPage;