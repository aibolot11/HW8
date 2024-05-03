import React, { useEffect, useState } from 'react';

function TodosPage(props) {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editedTodo, setEditedTodo] = useState({ id: null, title: '' });

    async function getTodos() {
        const response = await fetch('http://localhost:8000/todos');
        const data = await response.json();
        setTodos(data);
    }

    async function createTodo(event) {
        event.preventDefault();
        setInput("");
        const todo = { title: input, status: false };

        const response = await fetch('http://localhost:8000/todos', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo)
        });

        if (response.ok) {
            getTodos();
        }
    }

    async function deleteTodo(id) {
        const response = await fetch(`http://localhost:8000/todos/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            getTodos();
        }
    }

    async function changeStatus(id, status) {
        const updatedTodo = todos.find(todo => todo.id === id);
        updatedTodo.status = status;

        const response = await fetch(`http://localhost:8000/todos/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTodo)
        });

        if (response.ok) {
            getTodos();
        }
    }

    async function updateTodo(updatedTodo) {
        const response = await fetch(`http://localhost:8000/todos/${updatedTodo.id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTodo)
        });

        if (response.ok) {
            getTodos();
            cancelEdit();
        }
    }

    function startEdit(todo) {
        setEditedTodo({ id: todo.id, title: todo.title });
        setEditMode(true);
    }

    function cancelEdit() {
        setEditedTodo({ id: null, title: '' });
        setEditMode(false);
    }

    useEffect(() => {
        getTodos();
    }, []);

    return (
        <div style={{ padding: '30px' }}>
            <h1>Todos</h1>
            <form onSubmit={createTodo}>
                <input value={input} type="text" onChange={(event) => setInput(event.target.value)} />
                <button>create todo</button>
            </form>
            {
                todos.map(todo => (
                    <div key={todo.id}>
                        {editMode && editedTodo.id === todo.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedTodo.title}
                                    onChange={(e) => setEditedTodo({ ...editedTodo, title: e.target.value })}
                                />
                                <button onClick={() => updateTodo(editedTodo)}>Сохранить</button>
                                <button onClick={cancelEdit}>Отмена</button>
                            </div>
                        ) : (
                            <p className={todo.status ? 'line' : ''}>
                                <input
                                    type="checkbox"
                                    checked={todo.status}
                                    onChange={(e) => changeStatus(todo.id, e.target.checked)}
                                />
                                {todo.title}
                                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                                <button onClick={() => startEdit(todo)}>Update</button>
                            </p>
                        )}
                    </div>
                ))
            }
        </div>
    );
}

export default TodosPage;
