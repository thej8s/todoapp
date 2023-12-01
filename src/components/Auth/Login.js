import React, { useState } from "react";
import "./Login.css";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  console.log("Rendering Login component");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredentials) => {
        console.log(userCredentials);
        onLogin(username);
        navigate("/todo");
      })
      .catch((error) => {
        if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password" ||
          error.code === "auth/invalid-login-credentials"
        ) {
          alert(
            "Incorrect username or password. Please enter correct details."
          );
        } else {
          console.error(error);
        }
      });
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>

      <p>
        <Link to="/signup" className="link">
          Don't have an account? Sign up here.
        </Link>
      </p>
    </div>
  );
};

export default Login;
