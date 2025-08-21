import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectDB } from './db.js';
import { Message } from './models/Message.js'; 

const PORT = 8000
const app = express()

app.use(cors())
app.use(express.json())

connectDB();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY)

app.post('/gemini', async (req, res) => {
    try {
        const { userId, history, message } = req.body;

        if (userId && message) {
            await Message.create({ userId, role: "user", content: message });
        }

        const model = genAI.getGenerativeModel({model: "gemini-1.5-flash-latest"});
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        if (userId && text) {
            await Message.create({ userId, role: "model", content: text });
        }
        
        res.send(text);

    } catch (error) {
        console.error("Erro na rota /gemini:", error);
        res.status(500).send("Erro interno do servidor.");
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

app.listen(PORT, () => console.log(`Running port ${PORT}`))