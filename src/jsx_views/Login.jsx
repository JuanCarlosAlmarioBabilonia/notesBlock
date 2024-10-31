import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
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

    // Configuración personalizada para SweetAlert2
    const customSwalConfig = {
        background: '#252525',
        color: '#CFCFCF',
        confirmButtonColor: '#30BE71',
        iconColor: '#606060',
        customClass: {
            popup: 'nunito-font',
            icon: 'swal-icon-class',
            title: "title-icon"
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        const url = isLogin ? 'https://fa8b-2800-484-4788-c300-14d9-dd0a-5791-6eb.ngrok-free.app/users/login' : 'https://fa8b-2800-484-4788-c300-14d9-dd0a-5791-6eb.ngrok-free.app/users';
    
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
    
            if (response.ok) {
                const tokenWithBearer = data.token.startsWith('Bearer ') 
                    ? data.token 
                    : `Bearer ${data.token}`;
                
                localStorage.setItem('token', tokenWithBearer);
                if (isLogin && data._id) {
                    localStorage.setItem('userId', data._id);
                } else if (!isLogin && data.data && data.data._id) {
                    localStorage.setItem('userId', data.data._id);
                } else {
                    console.error('No se pudo obtener el ID del usuario:', data);
                }
            
                if (onLogin) {
                    onLogin(tokenWithBearer, isLogin ? data._id : data.data._id);
                }
            
                // Muestra un mensaje de éxito con la configuración personalizada
                Swal.fire({
                    icon: 'success',
                    title: isLogin ? 'Inicio de sesión exitoso' : 'Registro y inicio de sesión exitoso',
                    text: isLogin ? '¡Bienvenido de nuevo!' : '¡Tu cuenta ha sido creada y has iniciado sesión!',
                    confirmButtonText: 'Continuar',
                    ...customSwalConfig
                }).then(() => {
                    navigate('/notes');
                });
            } else {
                // Mostrar mensaje de error en caso de fallo con la configuración personalizada
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || (isLogin ? 'Error en el inicio de sesión' : 'Error en el registro'),
                    ...customSwalConfig
                });
            }
        } catch (error) {
            // Error de conexión con la configuración personalizada
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor.',
                ...customSwalConfig
            });
        }
    };    

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setUsername('');
        setPassword('');
        setEmail('');
        setNombre('');
        setApellido('');

        // Muestra mensaje de modo cambiado con la configuración personalizada
        Swal.fire({
            icon: 'info',
            title: isLogin ? 'Modo de Registro' : 'Modo de Inicio de Sesión',
            text: isLogin 
                ? 'Ahora estás en el modo de registro para crear una cuenta.' 
                : 'Ahora estás en el modo de inicio de sesión para acceder.',
            ...customSwalConfig
        });
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