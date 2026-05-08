import React, { useState } from 'react';
import './Home.css';

export default function Home({ onEnterBoard }) {
  const [joinId, setJoinId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createBoard = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/board', { method: 'POST' });
      const data = await res.json();
      onEnterBoard(data.id);
    } catch { setError('Ошибка подключения к серверу'); }
    finally { setLoading(false); }
  };

  return (
    <div className="home">
      <div className="home-card">
        <div className="home-logo">◈</div>
        <h1>Collaborative Board</h1>
        <p className="home-sub">Совместная интерактивная доска в реальном времени</p>
        <button className="btn-create" onClick={createBoard} disabled={loading}>
          {loading ? 'Создаём...' : '+ Создать новую доску'}
        </button>
        {error && <p className="home-error">{error}</p>}
        <div className="divider"><span>или</span></div>
        <div className="join-row">
          <input placeholder="Введите ID доски" value={joinId} onChange={e => setJoinId(e.target.value)} onKeyDown={e => e.key === 'Enter' && onEnterBoard(joinId.trim())} />
          <button className="btn-join" onClick={() => joinId.trim() && onEnterBoard(joinId.trim())}>Войти</button>
        </div>
      </div>
    </div>
  );
}
