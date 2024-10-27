import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/App.css';
import h1 from "../assets/imgs/h1.svg";
import h2 from "../assets/imgs/h2.svg";
import emptyContent from "../assets/imgs/rafiki.svg";
import plus from "../assets/imgs/plus.svg";

export default function NotesApp({ userId, token }) {
    const [notas, setNotas] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const pastelColors = [
        '#FD99FF', 
        '#FF9E9E', 
        '#91F48F', 
        '#FFF599', 
        '#9EFFFF', 
        '#B69CFF', 
    ];

    useEffect(() => {
        console.log(":)")
        const fetchNotas = async () => {
            if (!token) {
                navigate('/'); 
                return;
            }

            try {
                const response = await fetch('https://localhost:3000/notes', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-version': '1.0.0',
                        'Authorization': token,
                    },
                });

                if (response.status === 401) {
                    navigate('/');
                    return;
                }

                const data = await response.json();
                if (Array.isArray(data.data)) {
                    setNotas(data.data);
                } else {
                    setNotas([]);
                }
            } catch (error) {
                setError('Error al cargar las notas: ' + error.message);
            }
        };

        fetchNotas();
    }, [navigate, token]);

    const handleAddNote = () => {
        navigate('/create-note'); // Navega a la página para crear una nueva nota
    };

    const handleNoteClick = (notaId) => {
        navigate(`/edit-note/${notaId}`); // Navega al editor con el ID de la nota
    };

    return (
        <div className='app'>
            <div className='header'>
                <div className='text'>
                    <h1>Notes</h1>
                </div>
                <div className='imgs'>
                    <img src={h1} alt="H1" />
                    <img src={h2} alt="H2" />
                </div>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="notes_list">
                {notas.length > 0 ? (
                    notas.map((nota, index) => (
                        <div
                            key={nota._id}
                            className="notesView"
                            style={{ backgroundColor: pastelColors[index % pastelColors.length] }}
                            onClick={() => handleNoteClick(nota._id)} // Maneja el clic en la nota
                        >
                            <h2 className="note_title">{nota.titulo}</h2>
                        </div>
                    ))
                ) : (
                    <div className="empty_state">
                        <img src={emptyContent} alt="Empty state" />
                        <p className="empty_text">Create your first note!</p>
                    </div>
                )}
            </div>

            <div className='plus' onClick={handleAddNote}>
                <img src={plus} alt="Add note" />
            </div>
        </div>
    );
}