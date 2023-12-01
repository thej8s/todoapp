import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import TodoList from "./components/TodoList";

function MainRoutes({
  isLoggedIn,
  handleLogin,
  handleSignup,
  handleLogout,
  todos,
  handleDeleteTodo,
  handleAddTodo,
  handleChecked,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !isLoggedIn &&
      (window.location.pathname === "/" || window.location.pathname === "/todo")
    ) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
      <Route
        path="/todo"
        element={
          <TodoList
            todos={todos}
            onDelete={handleDeleteTodo}
            onAddTodo={handleAddTodo}
            onChecked={handleChecked}
            onLogout={handleLogout}
          />
        }
      />
    </Routes>
  );
}

export default MainRoutes;
