require("dotenv").config(); // Carrega as variáveis de ambiente do .env
console.log("MONGODB_URI:", process.env.MONGODB_URI);
const express = require("express"); // Importa o framework Express para criar a API
const mongoose = require("mongoose"); // Importa o Mongoose para interagir com o MongoDB
const cors = require("cors"); // Importa o pacote cors
const todoRoutes = require("./routes/todos"); // Importa as rotas de tarefas

const app = express(); // Cria uma instância do aplicativo Express
const PORT = process.env.PORT || 5001; // Define a porta do servidor, usa a variável de ambiente PORT ou 5000 como padrão
const MONGODB_URI = process.env.MONGODB_URI; // Armazena a URI do MongoDB a partir das variáveis de ambiente

// Conexão com o MongoDB
mongoose
  .connect(MONGODB_URI) // Tenta conectar ao banco de dados MongoDB usando a URI
  .then(() => console.log("Conectado ao MongoDB!")) // Exibe mensagem de sucesso se a conexão for estabelecida
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err)); // Exibe erro se a conexão falhar

// Middlewares
app.use(cors()); // Habilita o CORS para a rota 3000 { origin: "http://localhost:3000" }
app.use(express.json()); // Permite que a API entenda JSON

// Rotas da API
app.use("/api/todos", todoRoutes); // Prefixo para as rotas de tarefas

// Rota padrão (opcional)
app.get("/", (req, res) => {
  res.send("API de Tarefas funcionando!"); // Responde com uma mensagem simples para a rota raiz (/)
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`); // Inicia o servidor e exibe a porta em que está rodando
});
