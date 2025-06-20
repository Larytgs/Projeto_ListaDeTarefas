const mongoose = require("mongoose"); // Importa o Mongoose para definir esquemas e modelos

const TodoSchema = new mongoose.Schema({
  // Define o esquema (estrutura) do modelo Todo
  text: {
    // Campo para o texto da tarefa
    type: String, // Tipo de dado é string
    required: true, // Campo obrigatório
  },
  completed: {
    // Campo para indicar se a tarefa está concluída
    type: Boolean, // Tipo de dado é booleano
    default: false, // Valor padrão é false (não concluída)
  },
  createdAt: {
    // Campo para a data de criação da tarefa
    type: Date, // Tipo de dado é data
    default: Date.now, // Valor padrão é a data atual
  },
});

module.exports = mongoose.model("Todo", TodoSchema); // Exporta o modelo Todo baseado no esquema definido
