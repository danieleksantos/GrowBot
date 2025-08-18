
# 🤖 GrowBot v.1

Aplicação web que simula um chat com inteligência artificial, integrando com o **Gemini (Google AI)**.

Este projeto faz parte de um **Desafio Técnico – Pessoa Desenvolvedora de Software Trainee**.

A versão atual (**GrowBot v.1**) entrega a base funcional do chat com front-end em React e integração com backend local.

---

### 📌 Funcionalidades atuais (v.1)

- Interface de chat simples com envio de perguntas.
- Integração com o Gemini para obter respostas.
- Histórico de mensagens exibido em tela.
- Renderização das respostas em **Markdown** para melhor visualização.
- Layout responsivo básico.

---

### 🚀 Tecnologias utilizadas

- **Frontend:** React + Vite
- **Estilização:** CSS puro
- **Integração AI:** API Gemini (via backend Node.js)
- **Controle de versão:** Git + GitHub

---

### 🛠️ Como rodar o projeto localmente

#### 1. Clonar o repositório


```bash 
git clone git clone https://github.com/danieleksantos/GrowBot.git
cd GrowBot
```

#### 2. Instalar dependências

```Bash
npm install
```
#### 3. Rodar o frontend
```Bash
npm run dev
```
O projeto estará disponível em: http://localhost:5173

#### 4. Rodar o backend
O backend é responsável por intermediar as chamadas à API do Gemini.  
Use **nodemon** para hot reload:
```Bash
npx nodemon server.js
```
Por padrão, a API responde em http://localhost:8000/gemini.

### 🌱 Próximas versões (branches futuras)
O projeto será evoluído em novas branches, até chegar na entrega final do desafio:

- v.2 – Autenticação simples: Login com nome de usuário para separar histórico por pessoa.

- v.3 – Persistência de histórico: Salvar mensagens no banco de dados (MongoDB ou PostgreSQL).

- v.4 – Feedback visual: Indicador de carregamento enquanto a IA responde.

- v.5 – Melhorias de UX/UI: Layout mais agradável, responsivo e acessível. Suporte a tema escuro/claro.
