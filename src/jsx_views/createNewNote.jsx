import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Save, Bold, Italic, Underline, Link, AlignLeft, List, ListOrdered, Code, Heading1, Sigma } from 'lucide-react';
import '../css/createNewNote.css';

export default function NoteEditor({token}) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        setError('');

        try {
            if (!token) {
                setError('No se encontró token de autenticación');
                setIsSaving(false);
                return;
            }

            const response = await fetch('https://localhost:3000/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-version': '1.0.0',
                    'Authorization': token
                },
                body: JSON.stringify({
                    titulo: title,
                    descripcion: content
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Nota guardada:', data);
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
                    placeholder="Title"
                    className="title-input"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type something..."
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
