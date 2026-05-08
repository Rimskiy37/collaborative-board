import React from 'react';
import './Toolbar.css';

const tools = [
  { id: 'select',   label: '↖', title: 'Выбрать' },
  { id: 'text',     label: 'T', title: 'Текст' },
  { id: 'rect',     label: '▬', title: 'Прямоугольник' },
  { id: 'circle',   label: '●', title: 'Круг' },
  { id: 'triangle', label: '▲', title: 'Треугольник' },
  { id: 'line',     label: '╱', title: 'Линия' },
  { id: 'image',    label: '🖼', title: 'Изображение' },
];

export default function Toolbar({ tool, setTool }) {
  return (
    <div className="toolbar">
      {tools.map(t => (
        <button key={t.id} className={`tool-btn ${tool === t.id ? 'active' : ''}`} title={t.title} onClick={() => setTool(t.id)}>
          <span className="tool-icon">{t.label}</span>
          <span className="tool-label">{t.title}</span>
        </button>
      ))}
    </div>
  );
}
