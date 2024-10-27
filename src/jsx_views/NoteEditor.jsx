import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, Save, Bold, Italic, Underline, Link, AlignLeft, List, ListOrdered, Code, Heading1, Sigma } from 'lucide-react';
import '../css/createNewNote.css';

export default function NoteEditor2() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener ID de la nota desde la URL

    console.log('NoteEditor mounted with ID:', id); // Verifica si el ID se obtiene correctamente

    // Recupera los detalles de la nota si hay un ID
    useEffect(() => {
        if (id) {
            console.log("ID válido encontrado, cargando detalles de la nota");
            fetchNoteDetails(id);
        } else {
            console.log("ID no encontrado");
        }
    }, [id]);

    const fetchNoteDetails = async (noteId) => {
        const token = localStorage.getItem('token'); // Obtener el token desde localStorage

        if (!token) {
            console.log('No token found, navigating to login');
            navigate('/'); 
            return;
        }

        console.log('Fetching note details for ID:', noteId); // Log para verificar el ID

        try {
            const response = await fetch(`https://localhost:3000/notes/${noteId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-version': '1.0.0',
                    'Authorization': token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Fetched note data:', data); // Log para verificar los datos obtenidos

                if (data.data) {
                    // Verifica si hay cambios y asigna el último cambio
                    const changes = data.data.cambios;
                    if (changes && changes.length > 0) {
                        const lastChange = changes[changes.length - 1];
                        setTitle(lastChange.titulo || data.data.titulo); // Usar el título del último cambio o el original
                        setContent(lastChange.descripcion || data.data.descripcion); // Usar la descripción del último cambio o la original
                    } else {
                        // Si no hay cambios, usar los valores originales
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
        if (isSaving) return; // Prevenir múltiples clics mientras se guarda
        setIsSaving(true);
        setError('');

        const token = localStorage.getItem('token'); // Obtener el token desde localStorage

        if (!token) {
            setError('No se encontró token de autenticación');
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch(`https://localhost:3000/notes/${id}`, { // Usa PUT para actualizar
                method: 'PUT',
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
                alert('Nota guardada exitosamente');
                navigate('/notes');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al guardar la nota');
            }
        } catch (error) {
            console.error('Error al guardar la nota:', error);
            setError('Error de conexión al guardar la nota');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="note-editor">
            <header className="editor-header">
                <button onClick={() => navigate('/notes')} className="icon-button">
                    <ArrowLeft />
                </button>
                <div className="header-actions">
                    <button className="icon-button">
                        <Eye />
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
            <footer className="editor-toolbar">
                <button className="toolbar-button"><Bold size={20} /></button>
                <button className="toolbar-button"><Italic size={20} /></button>
                <button className="toolbar-button"><Underline size={20} /></button>
                <button className="toolbar-button"><Link size={20} /></button>
                <button className="toolbar-button"><AlignLeft size={20} /></button>
                <button className="toolbar-button"><List size={20} /></button>
                <button className="toolbar-button"><ListOrdered size={20} /></button>
                <button className="toolbar-button"><Code size={20} /></button>
                <button className="toolbar-button"><Heading1 size={20} /></button>
                <button className="toolbar-button"><Sigma size={20} /></button>
            </footer>
        </div>
    );
}
