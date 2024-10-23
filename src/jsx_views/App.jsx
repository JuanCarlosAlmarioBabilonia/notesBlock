import { useEffect, useState } from 'react';
import '../css/App.css';
import h1 from "../assets/imgs/h1.svg";
import h2 from "../assets/imgs/h2.svg";
import emptyContent from "../assets/imgs/rafiki.svg";
import plus from "../assets/imgs/plus.svg";

export default function NotesApp() {
  const [notas, setNotas] = useState([]);
  const idUsuario = '6716eb219bd23fa3b04f9469'; 

  const pastelColors = [
    '#FD99FF', 
    '#FF9E9E', 
    '#91F48F', 
    '#FFF599', 
    '#9EFFFF', 
    '#B69CFF', 
  ];

  useEffect(() => {
    const fetchNotas = async () => {
      try {
        const response = await fetch(`https://localhost:3000/notes/${idUsuario}`, {
          headers: {
            'x-version': '1.0.0',
          },
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
        
        if (Array.isArray(data.data)) {
          setNotas(data.data); 
        } else {
          console.error('Formato inesperado en la respuesta de la API:', data);
        }
      } catch (error) {
        console.error('Error fetching notas:', error);
      }
    };
  
    fetchNotas();
  }, [idUsuario]); 

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

      <div className="notes_list">
        {notas.length > 0 ? (
          notas.map((nota, index) => (
            <div
              key={nota._id}
              className="notesView"
              style={{ backgroundColor: pastelColors[index % pastelColors.length] }} 
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

      <div className='plus'>
        <img src={plus} alt="Add note" />
      </div>
    </div>
  );
}
