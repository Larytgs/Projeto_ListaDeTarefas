const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

// GET - Obter todas as tarefas
router.get("/", async (req, res) => {
  // Define uma rota GET na raiz do roteador (ex.: /api/todos)
  try {
    const todos = await Todo.find(); // Busca todas as tarefas no banco de dados
    res.json(todos); // Retorna as tarefas em formato JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Retorna erro 500 se algo falhar
  }
});

// POST - Adicionar uma nova tarefa
router.post("/", async (req, res) => {
  // Define uma rota POST na raiz (ex.: /api/todos)
  const todo = new Todo({
    // Cria uma nova instância do modelo Todo
    text: req.body.text, // Define o texto da tarefa a partir do corpo da requisição
  });
  try {
    const newTodo = await todo.save(); // Salva a nova tarefa no banco de dados
    res.status(201).json(newTodo); // Retorna a tarefa criada com status 201 (Created)
  } catch (err) {
    res.status(400).json({ message: err.message }); // Retorna erro 400 se a requisição for inválida
  }
});

// PUT - Atualizar uma tarefa
router.put("/:id", async (req, res) => {
  // Define uma rota PUT com parâmetro de ID (ex.: /api/todos/123)
  try {
    const todo = await Todo.findById(req.params.id); // Busca a tarefa pelo ID
    if (todo == null) {
      // Verifica se a tarefa existe
      return res.status(404).json({ message: "Tarefa não encontrada" }); // Retorna erro 404 se não encontrada
    }

    if (req.body.text != null) {
      // Atualiza o texto se fornecido no corpo da requisição
      todo.text = req.body.text;
    }
    if (req.body.completed != null) {
      // Atualiza o status de conclusão se fornecido
      todo.completed = req.body.completed;
    }

    const updatedTodo = await todo.save(); // Salva as alterações no banco de dados
    res.json(updatedTodo); // Retorna a tarefa atualizada
  } catch (err) {
    res.status(400).json({ message: err.message }); // Retorna erro 400 se a requisição for inválida
  }
});

// DELETE - Excluir uma tarefa
router.delete("/:id", async (req, res) => {
  // Define uma rota DELETE com parâmetro de ID (ex.: /api/todos/123)
  try {
    const todo = await Todo.findById(req.params.id); // Busca a tarefa pelo ID
    if (todo == null) {
      // Verifica se a tarefa existe
      return res.status(404).json({ message: "Tarefa não encontrada" }); // Retorna erro 404 se não encontrada
    }
    await Todo.deleteOne({ _id: req.params.id }); // Remove a tarefa do banco de dados
    res.json({ message: "Tarefa excluída com sucesso!" }); // Retorna mensagem de sucesso
  } catch (err) {
    res.status(500).json({ message: err.message }); // Retorna erro 500 se algo falhar
  }
});

module.exports = router; // Exporta o roteador para ser usado em App.js
