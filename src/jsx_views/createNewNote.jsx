import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ArrowLeft, Save, Trash } from 'lucide-react'; 
import '../css/createNewNote.css';

export default function NoteEditor2() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); 
    const navigate = useNavigate();
    const { id } = useParams();
    const contentRef = useRef(null);

    useEffect(() => {
        // Al detectar cambios en el título o contenido, se establece hasUnsavedChanges en true
        setHasUnsavedChanges(title !== '' || content !== '');
    }, [title, content]);

    useEffect(() => {
        if (id) {
            fetchNoteDetails(id);
        }
    }, [id]);

    const fetchNoteDetails = async (noteId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            Swal.fire({
                title: 'Error',
                text: 'No estás autenticado. Por favor inicia sesión.',
                icon: 'error',
                customClass: {
                    popup: 'nunito-font'  
                }
            });
            navigate('/');
            return;
        }

        try {
            const response = await fetch(`https://fa8b-2800-484-4788-c300-14d9-dd0a-5791-6eb.ngrok-free.app/notes/${noteId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-version': '1.0.0',
                    'Authorization': token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.data) {
                    const changes = data.data.cambios;
                    if (changes && changes.length > 0) {
                        const lastChange = changes[changes.length - 1];
                        setTitle(lastChange.titulo || data.data.titulo);
                        setContent(lastChange.descripcion || data.data.descripcion);
                    } else {
                        setTitle(data.data.titulo);
                        setContent(data.data.descripcion);
                    }
                }
            } else {
                setError('Error al cargar la nota');
            }
        } catch (error) {
            console.error('Error al cargar la nota:', error);
            setError('Error de conexión al cargar la nota');
        }
    };

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        setError('');

        const token = localStorage.getItem('token');

        if (!token) {
            Swal.fire({
                title: 'Error',
                text: 'No se encontró token de autenticación',
                icon: 'error',
                customClass: {
                    popup: 'nunito-font'  
                }
            });
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch(`https://fa8b-2800-484-4788-c300-14d9-dd0a-5791-6eb.ngrok-free.app/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-version': '1.0.0',
                    'Authorization': token,
                },
                body: JSON.stringify({
                    titulo: title,
                    descripcion: content,
                }),
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Nota guardada exitosamente',
                    icon: 'success',
                    customClass: {
                        popup: 'nunito-font'  
                    }
                }).then(() => {
                    navigate('/notes');
                });
            } else {
                const errorData = await response.json();
                Swal.fire({
                    title: 'Error',
                    text: errorData.message || 'Error al guardar la nota',
                    icon: 'error',
                    customClass: {
                        popup: 'nunito-font'  
                    }
                });
            }
        } catch (error) {
            console.error('Error al guardar la nota:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error de conexión al guardar la nota',
                icon: 'error',
                customClass: {
                    popup: 'nunito-font'  
                }
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            Swal.fire({
                title: 'Error',
                text: 'No estás autenticado. Por favor inicia sesión.',
                icon: 'error',
                customClass: {
                    popup: 'nunito-font'
                }
            }).then(() => {
                navigate('/');
            });
            return;
        }

        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'No podrás recuperar esta nota una vez eliminada',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                customClass: {
                    popup: 'nunito-font'
                }
            });

            if (result.isConfirmed) {
                const response = await fetch(`https://fa8b-2800-484-4788-c300-14d9-dd0a-5791-6eb.ngrok-free.app/notes/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-version': '1.0.0',
                        'Authorization': token,
                    },
                });

                if (response.ok) {
                    Swal.fire({
                        title: 'Eliminado',
                        text: 'Nota eliminada exitosamente',
                        icon: 'success',
                        customClass: {
                            popup: 'nunito-font'
                        }
                    }).then(() => {
                        navigate('/notes');
                    });
                } else {
                    const errorData = await response.json();
                    Swal.fire({
                        title: 'Error',
                        text: errorData.message || 'Error al eliminar la nota',
                        icon: 'error',
                        customClass: {
                            popup: 'nunito-font'
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error al eliminar la nota:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error de conexión al eliminar la nota',
                icon: 'error',
                customClass: {
                    popup: 'nunito-font'
                }
            });
        }
    };

    const handleBackNavigation = async () => {
        if (hasUnsavedChanges) {
            const result = await Swal.fire({
                title: '¿Desea abandonar sin guardar los cambios?',
                text: 'Los cambios no guardados se perderán.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, abandonar',
                cancelButtonText: 'No, regresar',
                customClass: {
                    popup: 'nunito-font'
                }
            });
            if (result.isConfirmed) {
                navigate('/notes');
            }
        } else {
            navigate('/notes');
        }
    };

    return (
        <div className="note-editor">
            <header className="editor-header">
                <button onClick={handleBackNavigation} className="icon-button">
                    <ArrowLeft />
                </button>
                <div className="header-actions">
                    <button className="icon-button" onClick={handleDelete}>
                        <Trash />
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="icon-button"
                        disabled={isSaving}
                    >
                        <Save />
                    </button>
                </div>
            </header>
            {error && <div className="error-message">{error}</div>}
            <main className="editor-content">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título"
                    className="title-input"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Descripción"
                    className="content-input"
                />
            </main>
        </div>
    );
}
