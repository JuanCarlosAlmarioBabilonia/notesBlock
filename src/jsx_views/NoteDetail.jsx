import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function NoteDetail() {
  const { id } = useParams();
  const [nota, setNota] = useState(null);

  useEffect(() => {
    const fetchNota = async () => {
      try {
        const response = await fetch(`https://localhost:3000/notes/${id}`);
        if (!response.ok) throw new Error('Error al obtener los datos');
        const data = await response.json();
        setNota(data.data);
      } catch (error) {
        console.error('Error fetching note:', error);
      }
    };
    fetchNota();
  }, [id]);

  return (
    <div>
      {nota ? (
        <>
          <h2>{nota.titulo}</h2>
          <p>{nota.descripcion}</p>
        </>
      ) : (
        <p>Cargando nota...</p>
      )}
    </div>
  );
}
