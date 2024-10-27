import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

export default function LoginRegister({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const url = isLogin ? 'https://localhost:3000/users/login' : 'https://localhost:3000/users';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-version': '1.0.0'
                },
                body: JSON.stringify(isLogin 
                    ? { username, password } 
                    : { nombre, apellido, email, username, password }),
            });

            const data = await response.json();
            
            if (response.ok && data.token) {
                const tokenWithBearer = data.token.startsWith('Bearer ') 
                    ? data.token 
                    : `Bearer ${data.token}`;
                
                localStorage.setItem('token', tokenWithBearer);
                localStorage.setItem('userId', data._id);

                if (onLogin) {
                    onLogin(tokenWithBearer, data._id);
                }
                
                navigate('/notes');
            } else {
                setError(data.message || (isLogin ? 'Error en el inicio de sesión' : 'Error en el registro'));
            }
        } catch (error) {
            setError('Error de conexión');
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        // Limpiar los campos al cambiar de modo
        setUsername('');
        setPassword('');
        setEmail('');
        setNombre('');
        setApellido('');
    };

    return (
        <div className="login-register-page">
            <div className="login-register-container">
                <h2>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre:</label>
                                <input
                                    id="nombre"
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apellido">Apellido:</label>
                                <input
                                    id="apellido"
                                    type="text"
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div className="form-group">
                        <label htmlFor="username">Usuario:</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                    </button>
                </form>
                <p className="toggle-mode" onClick={toggleMode}>
                    {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                </p>
            </div>
        </div>
    );
}