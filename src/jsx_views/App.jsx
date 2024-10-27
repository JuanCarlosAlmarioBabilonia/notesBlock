import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import NotesApp from './NotesApp';
import NoteEditor from './createNewNote';  // Cambia a la ruta correcta de NoteEditor si es necesario
import NoteEditor2 from "./NoteEditor"

function App() {
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Recuperar token y userId de localStorage al cargar el componente
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');

        if (storedToken && storedUserId) {
            setToken(storedToken);
            setUserId(storedUserId);
        }
        setIsLoaded(true);
    }, []);

    const handleLogin = (token, _id) => {
        // Almacenar token y userId en el estado y localStorage al iniciar sesión
        setUserId(_id);
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', _id);
    };

    if (!isLoaded) return null; // Esperar a que los datos se carguen desde localStorage

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login onLogin={handleLogin} />} />
                <Route path="/notes" element={
                    token ? <NotesApp userId={userId} token={token} /> : <Navigate to="/" replace />
                } />
                <Route path="/create-note" element={
                    token ? <NoteEditor userId={userId} token={token} /> : <Navigate to="/" replace />
                } />
                <Route path="/edit-note/:id" element={
                    token ? <NoteEditor2 userId={userId} token={token} /> : <Navigate to="/" replace />
                } />
            </Routes>
        </Router>
    );
}

export default App;
