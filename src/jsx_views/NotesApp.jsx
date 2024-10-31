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

export default function NotesApp({ userId, token }) {
    const [userNotas, setUserNotas] = useState([]);
    const [notas, setNotas] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearchMenu, setShowSearchMenu] = useState(false);
    const [showEmptyState, setShowEmptyState] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [showH2, setShowH2] = useState(false); // Inicialmente en false
    const navigate = useNavigate();

    const pastelColors = ['#FD99FF', '#FF9E9E', '#91F48F', '#FFF599', '#9EFFFF', '#B69CFF'];

    useEffect(() => {
        const fetchNotas = async () => {
            if (!token) {
                navigate('/'); 
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/notes', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-version': '1.0.0',
                        'Authorization': token,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserNotas(data.data);
                    setNotas(data.data);
                } else {
                    setError('Error al cargar las notas: ' + response.statusText);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al cargar las notas',
                        text: response.statusText,
                        confirmButtonText: 'Aceptar',
                        customClass: {
                            popup: 'nunito-font'
                        }
                    });
                }
            } catch (error) {
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
    }, [navigate, token]);

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
        try {
            const response = await fetch('http://localhost:3000/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-version': '1.0.0',
                    'Authorization': token,
                },
            });

            if (response.ok) {
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
                        placeholder="Search by the keyword..."
                    />
                </div>
            )}

            {/* Capa de desenfoque activada cuando el H2 se muestra */}
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
                        <p className="made-by">Made by</p>
                    </div>
                </div>
                </div>
            )}

<div className="notes_list">
    {userNotas.length === 0 ? ( // Si no hay notas
        <div className="empty_state">
            <img src={rafiki} />
            <p className="empty_text">Create your first note!</p>
        </div>
    ) : hasSearchResults ? ( // Si hay notas y hay resultados de búsqueda
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
    ) : ( // Si hay notas pero no hay resultados de búsqueda
        <div className="empty_state">
            <img src={cuate} />
            <p className="empty_text">File not found. Try searching again.</p>
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
