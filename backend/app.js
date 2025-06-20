require("dotenv").config(); // Carrega as variáveis de ambiente do .env
console.log(process.env.MONGODB_URI);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Importa o pacote cors
const todoRoutes = require("./routes/todos"); // Importa as rotas de tarefas

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Conexão com o MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Conectado ao MongoDB!"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Middlewares
app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json()); // Permite que a API entenda JSON

// Rotas da API
app.use("/api/todos", todoRoutes); // Prefixo para as rotas de tarefas

// Rota padrão (opcional)
app.get("/", (req, res) => {
  res.send("API de Tarefas funcionando!");
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
