import React, { useState } from 'react';
import Home from './pages/Home';
import Board from './pages/Board';

export default function App() {
  const [boardId, setBoardId] = useState(null);

  if (boardId) {
    return <Board boardId={boardId} onLeave={() => setBoardId(null)} />;
  }
  return <Home onEnterBoard={setBoardId} />;
}
