import React, { useState, useEffect } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";
import MainRoutes from "./MainRoutes";
import { signOut, onAuthStateChanged } from "firebase/auth";
import db, { auth } from "./components/firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const App = () => {
  const [username, setUsername] = useState("");
  const [todos, setTodos] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      const userDocRef = doc(collection(db, "users"), auth.currentUser.uid);
      const tasksCollection = collection(userDocRef, "tasks");

      const unsubscribe = onSnapshot(tasksCollection, (snapshot) => {
        setTodos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });

      return () => unsubscribe();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUsername(user.email);
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignup = async (newUsername) => {
    console.log(`User signed up: ${newUsername}`);
    const userDocRef = await addDoc(collection(db, "users"), {
      username: newUsername,
    });
    setIsLoggedIn(true);
    setUsername(newUsername);
  };

  const handleLogin = (loggedInUsername) => {
    console.log(`User logged in: ${loggedInUsername}`);
    setIsLoggedIn(true);
    setUsername(loggedInUsername);
  };

  const handleLogout = () => {
    console.log(`User logged out: ${username}`);
    setIsLoggedIn(false);
    setUsername("");
    signOut(auth)
      .then(() => {
        console.log("singout success");
        navigate("/login");
      })
      .catch((error) => console.log(error));
  };

  const handleAddTodo = async (text, timestamp) => {
    const userDocRef = doc(collection(db, "users"), auth.currentUser.uid);
    const tasksCollection = collection(userDocRef, "tasks");
    const newTodoRef = await addDoc(tasksCollection, {
      text,
      status: false,
      timestamp,
    });

    setTodos([...todos, { id: newTodoRef.id, text, status: false, timestamp }]);
  };

  const handleDeleteTodo = async (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    const userDocRef = doc(collection(db, "users"), auth.currentUser.uid);
    const tasksCollection = collection(userDocRef, "tasks");
    const todoDocRef = doc(tasksCollection, id);
    try {
      await deleteDoc(todoDocRef);
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleChecked = async (id, checked) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, status: checked } : todo
      )
    );

    const userDocRef = doc(collection(db, "users"), auth.currentUser.uid);
    const tasksCollection = collection(userDocRef, "tasks");
    const todoDocRef = doc(tasksCollection, id);

    try {
      await updateDoc(todoDocRef, { status: checked });
      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className="heading">Task Management App</h1>
      <MainRoutes
        isLoggedIn={isLoggedIn}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        handleLogout={handleLogout}
        todos={todos}
        handleDeleteTodo={handleDeleteTodo}
        handleAddTodo={handleAddTodo}
        handleChecked={handleChecked}
      />
    </div>
  );
};

export default App;
