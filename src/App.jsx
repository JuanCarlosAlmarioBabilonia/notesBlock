import { useEffect, useState } from 'react';
import { Search, Plus, Settings } from 'lucide-react';
import './App.css';

export default function Component() {
  const [notas, setNotas] = useState([]);

  useEffect(() => {
    const fetchNotas = async () => {
      try {
        const response = await fetch('https://localhost:3000/nota/v1');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();  
        setNotas(data.data || []); // Asignar las notas al estado
      } catch (error) {
        console.error('Error fetching notas:', error);
      }
    };

    fetchNotas();
  }, []); 

  return (
    <div className="notes-app">
      <header className="notes-header">
        <h1 className="notes-title">Notes</h1>
        <div className="notes-actions">
          <button className="icon-button">
            <Search size={20} />
          </button>
          <button className="icon-button">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="notes-main">
        <div className="users-list">
        {notas.length > 0 ? (
  notas.map((nota) => (
    <div key={nota._id} className="user-item">
      <p>{nota.titulo}</p>
      <p>{nota.contenido}</p>
    </div>
  ))
) : (
      <>
        <svg
          className="notes-illustration"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="60" y="30" width="80" height="120" fill="#4B5563" />
          <path d="M60 30L140 30L130 50L70 50L60 30Z" fill="#6B7280" />
          <rect x="70" y="60" width="60" height="10" fill="#9CA3AF" />
          <rect x="70" y="80" width="60" height="10" fill="#9CA3AF" />
          <rect x="70" y="100" width="40" height="10" fill="#9CA3AF" />
          <circle cx="100" cy="160" r="20" fill="#4B5563" />
          <path d="M90 160L110 160M100 150L100 170" stroke="#9CA3AF" strokeWidth="4" />
        </svg>
        <p className="notes-prompt">Create your first note!</p>
      </>
    )}
        </div>
      </main>

      <div className="fab-container">
        <button className="fab">
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}
