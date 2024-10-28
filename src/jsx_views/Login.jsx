import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert2
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

                // Muestra un mensaje de éxito utilizando SweetAlert2
                Swal.fire({
                    icon: 'success',
                    customClass: {
                        popup: 'nunito-font'  // Esto aplicará la fuente personalizada
                    },
                    title: isLogin ? 'Inicio de sesión exitoso' : 'Registro exitoso',
                    text: isLogin ? '¡Bienvenido de nuevo!' : '¡Tu cuenta ha sido creada!',
                    confirmButtonText: 'Continuar'
                }).then(() => {
                    navigate('/notes'); // Navega a la página de notas después de cerrar el alert
                });
            } else {
                // Mostrar mensaje de error en caso de fallo
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    customClass: {
                        popup: 'nunito-font'  // Esto aplicará la fuente personalizada
                    },
                    text: data.message || (isLogin ? 'Error en el inicio de sesión' : 'Error en el registro'),
                });
            }
        } catch (error) {
            // Error de conexión
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor.',
                customClass: {
                    popup: 'nunito-font'  // Esto aplicará la fuente personalizada
                }
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

        // Muestra mensaje de modo cambiado
        Swal.fire({
            icon: 'info',
            customClass: {
                popup: 'nunito-font'  // Esto aplicará la fuente personalizada
            },
            title: isLogin ? 'Modo de Registro' : 'Modo de Inicio de Sesión',
            text: isLogin 
                ? 'Ahora estás en el modo de registro para crear una cuenta.' 
                : 'Ahora estás en el modo de inicio de sesión para acceder.',
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
