import React from 'react';
import './PropertiesPanel.css';

export default function PropertiesPanel({ object, onUpdate, onDelete }) {
  const set = (key, value) => onUpdate({ ...object, [key]: value });
  const num = (key, value) => set(key, Number(value));

  return (
    <div className="props-panel">
      <div className="props-header">
        <span>Свойства</span>
        <button className="btn-delete" onClick={onDelete} title="Удалить">🗑</button>
      </div>

      <div className="props-type">Тип: <strong>{typeLabel(object.type)}</strong></div>

      <div className="props-section">
        <label>X</label>
        <input type="number" value={Math.round(object.x)} onChange={e => num('x', e.target.value)} />
        <label>Y</label>
        <input type="number" value={Math.round(object.y)} onChange={e => num('y', e.target.value)} />
      </div>

      {/* TEXT */}
      {object.type === 'text' && <>
        <div className="props-section">
          <label>Текст</label>
          <textarea rows={3} value={object.text || ''} onChange={e => set('text', e.target.value)} />
        </div>
        <div className="props-section">
          <label>Размер шрифта</label>
          <input type="number" value={object.fontSize || 18} onChange={e => num('fontSize', e.target.value)} />
          <label>Цвет</label>
          <input type="color" value={object.color || '#ffffff'} onChange={e => set('color', e.target.value)} />
        </div>
        <div className="props-section">
          <label>Ширина</label>
          <input type="number" value={object.width || 120} onChange={e => num('width', e.target.value)} />
        </div>
      </>}

      {/* RECT */}
      {object.type === 'rect' && <>
        <div className="props-section">
          <label>Ширина</label>
          <input type="number" value={object.width || 120} onChange={e => num('width', e.target.value)} />
          <label>Высота</label>
          <input type="number" value={object.height || 80} onChange={e => num('height', e.target.value)} />
        </div>
        <div className="props-section">
          <label>Цвет линии</label>
          <input type="color" value={object.color || '#7c6af7'} onChange={e => set('color', e.target.value)} />
          <label>Заливка</label>
          <input type="color" value={object.fill?.slice(0,7) || '#7c6af7'} onChange={e => set('fill', e.target.value + '44')} />
        </div>
        <div className="props-section">
          <label>Толщина линии</label>
          <input type="number" min={1} max={20} value={object.lineWidth || 2} onChange={e => num('lineWidth', e.target.value)} />
        </div>
      </>}

      {/* CIRCLE */}
      {object.type === 'circle' && <>
        <div className="props-section">
          <label>Радиус</label>
          <input type="number" value={object.radius || 50} onChange={e => num('radius', e.target.value)} />
        </div>
        <div className="props-section">
          <label>Цвет линии</label>
          <input type="color" value={object.color || '#22c55e'} onChange={e => set('color', e.target.value)} />
          <label>Заливка</label>
          <input type="color" value={object.fill?.slice(0,7) || '#22c55e'} onChange={e => set('fill', e.target.value + '44')} />
        </div>
        <div className="props-section">
          <label>Толщина линии</label>
          <input type="number" min={1} max={20} value={object.lineWidth || 2} onChange={e => num('lineWidth', e.target.value)} />
        </div>
      </>}

      {/* TRIANGLE */}
      {object.type === 'triangle' && <>
        <div className="props-section">
          <label>Размер</label>
          <input type="number" value={object.size || 80} onChange={e => num('size', e.target.value)} />
        </div>
        <div className="props-section">
          <label>Цвет линии</label>
          <input type="color" value={object.color || '#f59e0b'} onChange={e => set('color', e.target.value)} />
          <label>Заливка</label>
          <input type="color" value={object.fill?.slice(0,7) || '#f59e0b'} onChange={e => set('fill', e.target.value + '44')} />
        </div>
        <div className="props-section">
          <label>Толщина линии</label>
          <input type="number" min={1} max={20} value={object.lineWidth || 2} onChange={e => num('lineWidth', e.target.value)} />
        </div>
      </>}

      {/* LINE */}
      {object.type === 'line' && <>
        <div className="props-section">
          <label>Цвет</label>
          <input type="color" value={object.color || '#e0e0e0'} onChange={e => set('color', e.target.value)} />
          <label>Толщина</label>
          <input type="number" min={1} max={20} value={object.lineWidth || 2} onChange={e => num('lineWidth', e.target.value)} />
        </div>
        <div className="props-section">
          <label>X2</label>
          <input type="number" value={object.x2 || 0} onChange={e => num('x2', e.target.value)} />
          <label>Y2</label>
          <input type="number" value={object.y2 || 0} onChange={e => num('y2', e.target.value)} />
        </div>
      </>}

      {/* IMAGE */}
      {object.type === 'image' && <>
        <div className="props-section">
          <label>URL</label>
          <input value={object.src || ''} onChange={e => set('src', e.target.value)} placeholder="https://..." />
        </div>
        <div className="props-section">
          <label>Ширина</label>
          <input type="number" value={object.width || 150} onChange={e => num('width', e.target.value)} />
          <label>Высота</label>
          <input type="number" value={object.height || 100} onChange={e => num('height', e.target.value)} />
        </div>
      </>}
    </div>
  );
}

function typeLabel(t) {
  return { text: 'Текст', rect: 'Прямоугольник', circle: 'Круг', triangle: 'Треугольник', line: 'Линия', image: 'Изображение' }[t] || t;
}
