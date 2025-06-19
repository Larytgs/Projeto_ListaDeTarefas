const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

// GET - Obter todas as tarefas
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Adicionar uma nova tarefa
router.post("/", async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT - Atualizar uma tarefa
router.put("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo == null) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    if (req.body.text != null) {
      todo.text = req.body.text;
    }
    if (req.body.completed != null) {
      todo.completed = req.body.completed;
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Excluir uma tarefa
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo == null) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }
    await Todo.deleteOne({ _id: req.params.id }); // Use deleteOne
    res.json({ message: "Tarefa excluída com sucesso!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
