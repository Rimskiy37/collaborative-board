import React, { useEffect, useRef, useState, useCallback } from 'react';
import Toolbar from '../components/Toolbar';
import CanvasBoard from '../components/CanvasBoard';
import PropertiesPanel from '../components/PropertiesPanel';
import './Board.css';

const WS_URL = 'ws://localhost:4000';

export default function Board({ boardId, onLeave }) {
  const [objects, setObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [tool, setTool] = useState('select');
  const [wsStatus, setWsStatus] = useState('connecting');
  const wsRef = useRef(null);

  const selectedObject = objects.find(o => o.id === selectedId) || null;

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.onopen = () => { ws.send(JSON.stringify({ type: 'join-board', boardId })); setWsStatus('connected'); };
    ws.onclose = () => setWsStatus('disconnected');
    ws.onerror = () => setWsStatus('error');
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      switch (msg.type) {
        case 'board-state': setObjects(msg.board.objects || []); break;
        case 'create-object': setObjects(prev => prev.find(o => o.id === msg.object.id) ? prev : [...prev, msg.object]); break;
        case 'update-object': setObjects(prev => prev.map(o => o.id === msg.object.id ? { ...o, ...msg.object } : o)); break;
        case 'move-object': setObjects(prev => prev.map(o => o.id === msg.id ? { ...o, x: msg.x, y: msg.y } : o)); break;
        case 'delete-object': setObjects(prev => prev.filter(o => o.id !== msg.id)); setSelectedId(id => id === msg.id ? null : id); break;
        default: break;
      }
    };
    return () => ws.close();
  }, [boardId]);

  const createObject = useCallback((type, x, y) => {
    const defaults = {
      text:     { text: 'Текст', fontSize: 18, color: '#ffffff', width: 120, height: 40 },
      rect:     { width: 120, height: 80, color: '#7c6af7', fill: '#7c6af733', lineWidth: 2 },
      circle:   { radius: 50, color: '#22c55e', fill: '#22c55e33', lineWidth: 2 },
      triangle: { size: 80, color: '#f59e0b', fill: '#f59e0b33', lineWidth: 2 },
      line:     { x2: x + 100, y2: y, color: '#e0e0e0', lineWidth: 2 },
      image:    { width: 150, height: 100, src: '' },
    };
    const obj = { type, x, y, ...defaults[type] };
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'create-object', object: obj }));
  }, []);

  const updateObject = useCallback((updated) => {
    setObjects(prev => prev.map(o => o.id === updated.id ? updated : o));
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'update-object', object: updated }));
  }, []);

  const moveObject = useCallback((id, x, y) => {
    setObjects(prev => prev.map(o => o.id === id ? { ...o, x, y } : o));
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'move-object', id, x, y }));
  }, []);

  const deleteObject = useCallback((id) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'delete-object', id }));
    setSelectedId(null);
  }, []);

  const statusColor = { connected: '#22c55e', connecting: '#f59e0b', disconnected: '#ef4444', error: '#ef4444' };

  return (
    <div className="board-layout">
      <header className="board-header">
        <button className="btn-back" onClick={onLeave}>← Назад</button>
        <div className="board-id-wrap">
          <span className="board-id-label">ID доски:</span>
          <code className="board-id">{boardId}</code>
          <button className="btn-copy" onClick={() => navigator.clipboard.writeText(boardId)}>Копировать</button>
        </div>
        <div className="ws-status">
          <span className="ws-dot" style={{ background: statusColor[wsStatus] }} />
          {wsStatus === 'connected' ? 'Подключено' : wsStatus === 'connecting' ? 'Подключение...' : 'Нет связи'}
        </div>
      </header>
      <div className="board-body">
        <Toolbar tool={tool} setTool={setTool} />
        <CanvasBoard objects={objects} selectedId={selectedId} setSelectedId={setSelectedId} tool={tool} setTool={setTool} onCreateObject={createObject} onMoveObject={moveObject} onDeleteObject={deleteObject} />
        {selectedObject && <PropertiesPanel object={selectedObject} onUpdate={updateObject} onDelete={() => deleteObject(selectedObject.id)} />}
      </div>
    </div>
  );
}
