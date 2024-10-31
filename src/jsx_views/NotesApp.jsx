import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import '../css/App.css';
import h1 from '../assets/imgs/h1.svg';
import h2 from '../assets/imgs/h2.svg';
import plus from '../assets/imgs/plus.svg';
import rafiki from "../assets/imgs/rafiki.svg";
import cuate from "../assets/imgs/cuate.svg";
import { LogOut } from 'lucide-react'; 

export default function NotesApp() {
    const [userNotas, setUserNotas] = useState([]);
    const [notas, setNotas] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearchMenu, setShowSearchMenu] = useState(false);
    const [showEmptyState, setShowEmptyState] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [showH2, setShowH2] = useState(false);
    const navigate = useNavigate();

    const pastelColors = ['#FD99FF', '#FF9E9E', '#91F48F', '#FFF599', '#9EFFFF', '#B69CFF'];

    useEffect(() => {
        const fetchNotas = async () => {
            const token = localStorage.getItem('token');
        
            if (!token) {
                navigate('/'); 
                return;
            }
        
            try {
                const response = await fetch('https://fa8b-2800-484-4788-c300-14d9-dd0a-5791-6eb.ngrok-free.app/notes', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-version': '1.0.0',
                        'Authorization': token,
                    },
                });
        
                // Revisa el código de estado antes de intentar parsear
                if (!response.ok) {
                    const errorData = await response.text(); // Obtén la respuesta como texto
                    console.error('Error response:', errorData);
                    throw new Error(`HTTP error! status: ${response.status}, response: ${errorData}`);
                }
        
                const data = await response.json();
                setUserNotas(data.data);
                setNotas(data.data);
            } catch (error) {
                console.error('Error de conexión:', error);
                setError('Error al cargar las notas: ' + error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: error.message,
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        popup: 'nunito-font'
                    }
                });
            }
        };

        fetchNotas();
    }, [navigate]);

    const handleAddNote = () => {
        navigate('/create-note');
    };

    const handleNoteClick = (notaId) => {
        navigate(`/edit-note/${notaId}`);
    };

    const handleSearch = (term) => {
        if (!term.trim()) {
            setNotas(userNotas);
            return;
        }

        setError(null);
        const filteredNotas = userNotas.filter(nota =>
            nota.titulo.toLowerCase().includes(term.toLowerCase()) || 
            (nota.descripcion && nota.descripcion.toLowerCase().includes(term.toLowerCase()))
        );
        setNotas(filteredNotas);
    };

    useEffect(() => {
        handleSearch(searchTerm); // Filtrar cada vez que el término de búsqueda cambie
    }, [searchTerm, userNotas]);

    const handleLogout = async () => {
        const token = localStorage.getItem('token'); // Obtener el token del local storage

        if (!token) {
            navigate('/');
            return;
        }

        try {
            const response = await fetch('https://fa8b-2800-484-4788-c300-14d9-dd0a-5791-6eb.ngrok-free.app/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-version': '1.0.0',
                    'Authorization': token,
                },
            });

            if (response.ok) {
                localStorage.removeItem('token'); // Eliminar el token del local storage
                Swal.fire({
                    icon: 'success',
                    title: 'Sesión cerrada correctamente',
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        popup: 'nunito-font'
                    }
                }).then(() => {
                    navigate('/');
                });
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error al cerrar sesión',
                    text: errorData.message || 'Error al cerrar sesión.',
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        popup: 'nunito-font'
                    }
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al cerrar sesión',
                text: error.message,
                confirmButtonText: 'Aceptar',
                customClass: {
                    popup: 'nunito-font'
                }
            });
        }
    };

    const toggleEmptyState = () => {
        setShowEmptyState(prevState => !prevState);
    };

    const handleBlurOverlayClick = () => {
        setShowH2(false);
    };

    const hasNoNotes = notas.length === 0; 
    const hasSearchResults = notas.length > 0; 

    return (
        <div className={`app ${showH2 ? 'blurred' : ''}`}>
            <div className='header'>
                <div className='text'>
                    <h1>Notas</h1>
                </div>
                <div className='imgs'>
                    <img src={h1} alt="H1" onClick={() => setShowSearchMenu(!showSearchMenu)} />
                    <img src={h2} alt="H2" onClick={() => setShowH2(true)} />
                    <button onClick={handleLogout} className="logout-button">
                        <LogOut />
                    </button>
                </div>
            </div>

            {showSearchMenu && (
                <div className="search-menu">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por palabra clave..."
                    />
                </div>
            )}

            {showH2 && (
                <div className="blur-overlay" onClick={handleBlurOverlayClick}>
                    <div className="hola">
                        <div className="empty-state-content">
                            <div className="credits">
                                <p>Designed by -</p>
                                <p>Redesigned by -</p>
                                <p>Illustrations -</p>
                                <p>Icons -</p>
                                <p>Font -</p>
                            </div>
                            <p className="made-by">Hecho por</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="notes_list">
                {userNotas.length === 0 ? (
                    <div className="empty_state">
                        <img src={rafiki} alt="Empty State" />
                        <p className="empty_text">¡Crea tu primera nota!</p>
                    </div>
                ) : hasSearchResults ? (
                    notas.map((nota, index) => (
                        <div
                            key={nota._id}
                            className="notesView"
                            style={{ backgroundColor: pastelColors[index % pastelColors.length] }}
                            onClick={() => handleNoteClick(nota._id)}
                        >
                            <h2 className="note_title">{nota.titulo}</h2>
                        </div>
                    ))
                ) : (
                    <div className="empty_state">
                        <img src={cuate} alt="File not found" />
                        <p className="empty_text">Archivo no encontrado. Intenta buscar de nuevo.</p>
                    </div>
                )}
            </div>

            <div className='plus' onClick={handleAddNote}>
                <img src={plus} alt="Add note" />
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedNote?.titulo}</h2>
                        <p>{selectedNote?.descripcion}</p>
                        <button onClick={() => setIsModalOpen(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}
