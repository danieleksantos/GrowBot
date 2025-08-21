import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectDB } from './db.js';
import { Message } from './models/Message.js';
import process from 'process';

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());

const corsOptions = {
    origin: ['http://localhost:5173', 'https://grow-bot.vercel.app'], 
    optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

connectDB();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

const normalizeString = (str) => {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

app.post('/gemini', async (req, res) => {
    try {
        const { userId, history, message } = req.body;
        
        const systemInstruction = `
            Você é um mentor de carreira especializado em apoiar pessoas em início de jornada na área de tecnologia — sejam estudantes que estão aprendendo programação ou profissionais em transição de carreira para o setor de TI.

            Suas respostas devem sempre:
            - Trazer conselhos práticos sobre programação, linguagens, ferramentas e boas práticas de desenvolvimento.
            - Compartilhar orientações sobre mercado de trabalho em TI, carreira de desenvolvedor(a) e caminhos de aprendizado.
            - Ser encorajadoras, acessíveis e realistas, transmitindo confiança para quem está começando.
            - Apresentar explicações claras e exemplos úteis que ajudem na evolução profissional.
            - Restringir-se ao escopo de carreira e tecnologia, evitando responder sobre assuntos não relacionados.

            Adote o tom de um mentor experiente: inspirador, acolhedor e orientado a resultados.
            Se o usuário fizer uma pergunta fora do escopo de tecnologia, programação ou carreira em TI, responda de forma educada e consistente com a seguinte mensagem:

"Opa! Essa pergunta foge um pouquinho do meu universo de códigos e carreira tech. Mas se quiser bater um papo sobre programação, tecnologia ou mercado de TI, tô 100% ligado nesses assuntos!"
        `;

        const outOfScopeKeywords = [
            "politica", "religiao", "esporte", "time", "celebridade", "ator", "cantor", "filme", "serie", "livro", "noticia", "fofoca", "morreu"
        ];
        
        const normalizedMessage = normalizeString(message);
        const isOutOfScope = outOfScopeKeywords.some(keyword => normalizedMessage.includes(keyword));

        if (isOutOfScope) {
            const outOfScopeMessage = "Entendo sua dúvida, mas meu foco aqui é ajudar em questões relacionadas a programação, tecnologia e carreira em TI. Se quiser, posso te orientar nesses assuntos!";
            
            const userMessage = new Message({
                userId,
                role: "user",
                content: message,
                timestamp: new Date()
            });
            await userMessage.save();
            
            const botMessage = new Message({
                userId,
                role: "model",
                content: outOfScopeMessage,
                timestamp: new Date()
            });
            await botMessage.save();
            
            return res.send(outOfScopeMessage);
        }
 
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
            systemInstruction: systemInstruction,
        });

        const chat = model.startChat({
            history: history
        });

        const result = await chat.sendMessage(message);
        const responseText = await result.response.text();

        const userMessage = new Message({
            userId,
            role: "user",
            content: message,
            timestamp: new Date()
        });
        await userMessage.save();

        const botMessage = new Message({
            userId,
            role: "model",
            content: responseText,
            timestamp: new Date()
        });
        await botMessage.save();

        res.send(responseText);
    } catch (error) {
        console.error('Erro ao chamar a API do Gemini:', error);
        res.status(500).send("Algo deu errado! Tente novamente mais tarde!");
    }
});

app.get("/api/history/:userId", async (req, res) => {
    try {
        const messages = await Message.find({ userId: req.params.userId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        console.error("Erro ao buscar histórico:", err);
        res.status(500).json({ error: "Falha ao buscar o histórico" });
    }
});

app.delete("/api/history/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await Message.deleteMany({ userId: userId });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Nenhum histórico de chat encontrado para este usuário." });
        }
        
        res.status(200).json({ message: "Histórico do chat limpo com sucesso." });
    } catch (error) {
        console.error("Erro ao limpar histórico do chat:", error);
        res.status(500).json({ error: "Falha ao limpar o histórico do chat." });
    }
});

app.listen(PORT, () => console.log(`Running port ${PORT}`));