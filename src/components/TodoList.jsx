import React, { useState, useEffect } from "react";
import "./TodoList.css";
import { collection, onSnapshot, doc } from "firebase/firestore";
import db, { auth } from "./firebase";

const TodoList = ({ onDelete, onAddTodo, onChecked, onLogout }) => {
  const [newTodoText, setNewTodoText] = useState("");

  const [dispTodos, setDispTodos] = useState([]);

  useEffect(() => {
    const fetchUserTasks = async () => {
      const userDocRef = doc(collection(db, "users"), auth.currentUser.uid);
      const tasksCollection = collection(userDocRef, "tasks");

      const unsubscribe = onSnapshot(tasksCollection, (snapshot) => {
        const todosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        todosData.sort((a, b) => b.timestamp - a.timestamp);

        setDispTodos(todosData);
      });

      return () => unsubscribe();
    };

    if (auth.currentUser) {
      fetchUserTasks();
    }
  }, []);

  const handleAddTodo = () => {
    if (newTodoText.trim() !== "") {
      const timestamp = new Date().getTime();
      onAddTodo(newTodoText, timestamp);
      setNewTodoText("");
    }
  };

  const handleChecked = (id, checked) => {
    onChecked(id, checked);
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="todocontainer">
      <div className="topbox">
        <h2>Todo List</h2>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="New Todo"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
        />
        <i onClick={handleAddTodo} className="fas fa-plus"></i>
      </div>
      <ul className="ulist">
        {dispTodos.map((todo) => {
          return (
            <div className="todo" key={todo.id}>
              <div className="left">
                <input
                  onChange={(e) => handleChecked(todo.id, e.target.checked)}
                  checked={todo.status}
                  type="checkbox"
                  name=""
                  id=""
                />
                <p>{todo.text}</p>
              </div>
              <div className="right">
                <i
                  onClick={() => onDelete(todo.id)}
                  className="fas fa-times"
                ></i>
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default TodoList;
