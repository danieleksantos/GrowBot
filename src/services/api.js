const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getGeminiResponse = async ({ userId, history, message }) => {
    try {
        const options = {
            method: 'POST',
            body: JSON.stringify({ userId, history, message }),
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const response = await fetch(`${API_BASE_URL}/gemini`, options);
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        const data = await response.text();
        return data;
    } catch (error) {
        console.error("Falha ao buscar a resposta da Gemini:", error);
        throw error;
    }
};

export const getChatHistoryFromDB = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/history/${userId}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar histórico: ${response.status}`);
        }
        const history = await response.json();
        return history;
    } catch (error) {
        console.error("Erro ao buscar histórico do chat:", error);
        throw error;
    }
};

export const clearChatHistoryFromDB = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/history/${userId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro ao apagar histórico: ${response.status}`);
        }
        return true; 
    } catch (error) {
        console.error("Erro ao conectar com a API para limpar o histórico:", error);
        throw error;
    }
};