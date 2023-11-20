import React, { useState, useEffect } from "react";
import "./todo.css";
import dev from "../../assets/images/dev.webp";
import bg from "../../assets/images/todo-bg.webp";


function Todo() {
	const [activity, setActivity] = useState("");
	const [edit, setEdit] = useState("");
	const [todos, setTodos] = useState(
		JSON.parse(localStorage.getItem("todos")) || []
	);
	const [msg, setMsg] = useState("");

	useEffect(() => {
		try {
			localStorage.setItem("todos", JSON.stringify(todos));
		} catch (error) {
			console.error("Error saving todos to local storage:", error);
		}
	}, [todos]);

	function generateId() {
		return Date.now();
	}

	function handleSubmit(e) {
		e.preventDefault();
		if (!activity) {
			return setMsg("Enter an activity");
		} else {
			setMsg("");
		}

		if (edit.id) {
			const newTodos = {
				id: edit.id,
				activity,
				isComplete: edit.isComplete,
			};
			const newTodo = todos.findIndex(function (todo) {
				return todo.id === edit.id;
			});

			const newTodoList = [...todos];
			newTodoList[newTodo] = newTodos;
			setTodos(newTodoList);
			setActivity("");
			setEdit("");
			return;
		}
		setTodos([...todos, { id: generateId(), activity, isComplete: false }]);
		setActivity("");
	}

	function removeHandler(id) {
		const newTodos = todos.filter(function (todo) {
			return todo.id !== id;
		});
		setTodos(newTodos);
		cancelHandler();
	}

	function editHandler(Todo) {
		setActivity(Todo.activity);
		setEdit(Todo);
	}

	function cancelHandler() {
		setActivity("");
		setEdit("");
	}

	// clear all todos
	function clearHandler() {
		setTodos([]);
	}

	function toggleComplete(id) {
		const newTodos = todos.map((todo) => {
			if (todo.id === id) {
				return {
					...todo,
					isComplete: !todo.isComplete,
				};
			}
			return todo;
		});
		setTodos(newTodos);
	}

	return (
		<div className="todo" style={{ background: `url(${bg})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
            <h2 className="title  animate__animated animate__zoomInDown">Todo</h2>
            <form className="todo__form form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="todo"
                    value={activity}
                    placeholder="Insert here..."
                    onChange={(e) => setActivity(e.target.value)}
                    className="form__input"
                />
                <div className="form__msg">
                    <p>{msg}</p>
                </div>
                <div className="form__btns btn">
                    <button
                        type="submit"
                        className="btn__new">
                        {edit.id ? "Save Todo" : "New Todo"}
                    </button>
                    {edit.id && (
                    <button
                        onClick={cancelHandler}
                        className="btn__cancel">
                        Cancel
                    </button>
                    )}
                    {todos.length > 0 && (
                        <button
                            onClick={clearHandler}
                            className="btn__clear">
                            Clear All
                        </button>
                    )}
                </div>
            </form>
			<div className="todo__container">
				<div className="todo__create">
					
                    <div className="todo__img">
                        <img src={dev} alt="Developer" />
                    </div>
				</div>

				<div className="todos">
					<div className="todos__container">
                        {todos.length === 0 ? (
                            <p className="todos__msg">
                                The list is empty
                            </p>
                            ) : (
                            <ul className="todos__list task">
                                {todos.map((todo) => (
                                    <li
                                        key={todo.id}
                                        className={todo.isComplete ? "task__complete" : ""}>
                                        <span className={todo.isComplete ? "task__complete" : ""}>
                                            {todo.activity}
                                        </span>
                                        <div className="task__btns but">
                                            <button
                                                onClick={() => editHandler(todo)}
                                                className={todo.isComplete ? "but__edit" : "but__edit--active"}>
                                                <i className="">Edit</i>
                                            </button>
                                            <button onClick={() => removeHandler(todo.id)}
                                                className={todo.isComplete ? "but__delete": "but__delete--active"}>
                                                <i className="">Delete</i>
                                            </button>
                                            {!todo.isComplete ? (
                                                <button onClick={() => toggleComplete(todo.id)}
                                                    className="but__check">
                                                    <i className="">Check</i>
                                                </button>
                                            ) : (
                                                <button onClick={() => toggleComplete(todo.id)}
                                                    className="but__uncheck">
                                                    <i className="">Uncheck</i>
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
				</div>
			</div>
		</div>
	);
}

export default Todo;