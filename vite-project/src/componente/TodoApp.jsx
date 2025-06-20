import { useEffect, useState } from "react";
import "./TodoApp.css";

const TodoApp = () => {
  //Lista de tarefas
  const [todos, setTodos] = useState([]);

  //Estado de texto de tarefas
  const [inputValue, setInputValue] = useState("");

  // Estado para controlar a tarefa em edição
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Add pelo GPT:
  const API_BASE_URL = "http://localhost:5001/api/todos"; // URL da sua API

  // Carregar tarefas ao montar o componente
  useEffect(() => {
    fetchTodos();
  }, []); // O array vazio garante que roda apenas uma vez

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  //Adicionar tarefas
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      try {
        const response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: inputValue, completed: false }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newTodo = await response.json();
        setTodos((prevTodos) => [...prevTodos, newTodo]);
        setInputValue("");
      } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
      }
    }
  };

  /// Iniciar edição
  const startEditing = (_id, text) => {
    setEditingId(_id);
    setEditText(text);
  };

  // Salvar edição  (Mudado pelo ChatGPT)
  const saveEdit = async (_id) => {
    if (editText.trim() !== "") {
      try {
        const response = await fetch(`${API_BASE_URL}/${_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: editText }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const updatedTodo = await response.json();
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === _id ? { ...todo, text: updatedTodo.text } : todo
          )
        );
        setEditingId(null);
        setEditText("");
      } catch (error) {
        console.error("Erro ao salvar edição:", error);
      }
    }
  };

  // Cancelar edição
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  //Excluir tarefa (Mudado pelo ChatGPT)
  const deleteTask = async (_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${_id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== _id));
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };
  // const deleteTask = (id) => {
  //   setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  // }; //filter(): Cria uma nova lista contendo apenas os itens cujo id não corresponde ao que foi clicado.
  //setTodos(): Atualiza o estado removendo a tarefa selecionada.

  // Alternar estado de conclusão (Mudado pelo ChatGPT)
  const toggleComplete = async (_id) => {
    const todoToUpdate = todos.find((todo) => todo._id === _id);
    if (!todoToUpdate) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !todoToUpdate.completed }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedTodo = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === _id
            ? { ...todo, completed: updatedTodo.completed }
            : todo
        )
      );
    } catch (error) {
      console.error("Erro ao alternar conclusão:", error);
    }
  };
  // const toggleComplete = (id) => {
  //   setTodos((prevTodos) =>
  //     prevTodos.map((todo) =>
  //       todo.id === id ? { ...todo, completed: !todo.completed } : todo
  //     )
  //   );
  // };

  return (
    <div className="app-container">
      <h1 className="title">Lista de tarefas</h1>

      {/* Form para adicionar tarefas */}
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          className="input-field"
          placeholder="Adicione uma tarefa..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="add-button">
          Adicionar
        </button>
      </form>

      {/* Lista de tarefas */}
      {todos.length === 0 && <p className="empty">Não há tarefas.</p>}

      {/* Apresentação da lista */}
      <ul className="todo-list">
        {todos.map((todo) => {
          //pegar cada map
          return (
            <li
              key={todo._id}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
            >
              {editingId === todo._id ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-input"
                  />
                  <button
                    onClick={() => saveEdit(todo._id)}
                    className="save-button"
                  >
                    Salvar
                  </button>
                  <button onClick={cancelEdit} className="cancel-button">
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <div className="task-content">
                    <button
                      onClick={() => startEditing(todo._id, todo.text)}
                      className="edit-button"
                    >
                      ✏️
                    </button>

                    <span
                      onClick={() => toggleComplete(todo._id)}
                      className="todo-text"
                    >
                      {todo.text}
                    </span>

                    <button
                      onClick={() => deleteTask(todo._id)}
                      className="delete"
                    >
                      ❌
                    </button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TodoApp;
