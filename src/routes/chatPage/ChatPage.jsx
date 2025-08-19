  import { useState } from "react"
  import ReactMarkdown from "react-markdown";
  import "./chatPage.css"
  import { ChatSession } from "@google/generative-ai"


  const ChatPage = () => {
    const [ value, setValue ] = useState ("")
    const [error, setError] = useState("")
    const [chatHistory, setChatHistory] = useState([])

    const surpriseOptions = [
      'Preciso fazer graduação para atuar como desenvolvedor?',
      'Qual é a média salarial de um dev júnior no Brasil?',
      'Qual a linguagem de programação mais utilizada no mundo?'
    ]

    const surprise = () => {
      const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
      setValue(randomValue)
    }

    const getResponse = async () => {
      if (!value) {
        setError("Por favor, faça uma pergunta!")
        return
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
        }
        const response = await fetch ('http://localhost:8000/gemini', options)
        const data = await response.text()
        console.log(data);
        setChatHistory(oldChatHistory => [...oldChatHistory, {
          role: "user",
          parts: [{ text: value }]
        },
      {
        role: "GrowBot",
        parts: [{ text: data }]
      }
      ])
      setValue("")
      
      } catch (error) {
        console.error(error)
        setError("Algo deu errado! Tente novamente mais tarde!")
      }
    }

    const clear = () => {
      setValue("")
      setError("")
      setChatHistory([])
    }

    return (
      <div className="chatPage">
        <p> O que você gostaria de saber? 
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
          <div className="serach-result">
            {chatHistory.map((chatItem, _index) => 
            <div key={_index}>
              <div className="answer">
                <strong>{chatItem.role}:</strong>
                <ReactMarkdown>
                  {(chatItem.parts && chatItem.parts.length > 0) ? chatItem.parts[0].text : 'Resposta vazia'}
                </ReactMarkdown>
              </div>
            </div>)}
          </div>
      </div>
    )
  }

  export default ChatPage
  