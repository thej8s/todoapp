import React, { useState } from "react";
import "./Signup.css";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";

const Signup = ({ onSignup }) => {
  console.log("Rendering Signup component");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSignup = (e) => {
    onSignup(username);

    setSignupSuccess(false);

    if (password.length < 6) {
      alert("Password should be at least 6 characters long.");
      return;
    }

    e.preventDefault();
    createUserWithEmailAndPassword(auth, username, password)
      .then((userCredentials) => {
        console.log(userCredentials);
        setSignupSuccess(true);
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          alert(
            "This email is already registered. Please use a different email."
          );
        } else {
          console.error(error);
        }
      });
  };

  return (
    <div className="container">
      <h2>Create an account</h2>
      <input
        type="email"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password (Minimum 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Signup</button>

      {signupSuccess && (
        <div className="success-message">
          <p className="success">Signup successful!</p>
          <p className="large-text">Welcome to our community!</p>
        </div>
      )}

      <p>
        Already have an account?{" "}
        <Link to="/login" className="slink">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
