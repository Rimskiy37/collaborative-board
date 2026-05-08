import React from 'react';
import './ObjectRenderer.css';

export default function ObjectRenderer({ obj, selected, onMouseDown, onClick }) {
  const base = { position: 'absolute', left: obj.x, top: obj.y, cursor: 'grab', userSelect: 'none' };
  const selClass = selected ? 'obj-selected' : '';

  switch (obj.type) {
    case 'text':
      return <div className={`obj obj-text ${selClass}`} style={{ ...base, fontSize: obj.fontSize || 18, color: obj.color || '#fff', width: obj.width || 'auto', minHeight: obj.height || 40, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} onMouseDown={onMouseDown} onClick={onClick}>{obj.text || 'Текст'}</div>;

    case 'rect':
      return <div className={`obj obj-shape ${selClass}`} style={{ ...base, width: obj.width || 120, height: obj.height || 80, border: `${obj.lineWidth || 2}px solid ${obj.color || '#7c6af7'}`, background: obj.fill || 'transparent', borderRadius: 4 }} onMouseDown={onMouseDown} onClick={onClick} />;

    case 'circle': {
      const r = obj.radius || 50;
      return <div className={`obj obj-shape ${selClass}`} style={{ ...base, width: r * 2, height: r * 2, borderRadius: '50%', border: `${obj.lineWidth || 2}px solid ${obj.color || '#22c55e'}`, background: obj.fill || 'transparent' }} onMouseDown={onMouseDown} onClick={onClick} />;
    }

    case 'triangle': {
      const s = obj.size || 80;
      return <svg className={`obj obj-shape ${selClass}`} style={{ ...base, overflow: 'visible' }} width={s} height={s * 0.866} onMouseDown={onMouseDown} onClick={onClick}><polygon points={`${s/2},0 ${s},${s*0.866} 0,${s*0.866}`} fill={obj.fill || 'transparent'} stroke={obj.color || '#f59e0b'} strokeWidth={obj.lineWidth || 2} /></svg>;
    }

    case 'line':
      return <svg className={`obj ${selClass}`} style={{ ...base, overflow: 'visible' }} width={Math.abs((obj.x2 || obj.x+100) - obj.x) + 20} height={Math.abs((obj.y2 || obj.y) - obj.y) + 20} onMouseDown={onMouseDown} onClick={onClick}><line x1={0} y1={0} x2={(obj.x2 || obj.x+100) - obj.x} y2={(obj.y2 || obj.y) - obj.y} stroke={obj.color || '#e0e0e0'} strokeWidth={obj.lineWidth || 2} strokeLinecap="round" /></svg>;

    case 'image':
      return <div className={`obj obj-image ${selClass}`} style={{ ...base, width: obj.width || 150, height: obj.height || 100 }} onMouseDown={onMouseDown} onClick={onClick}>{obj.src ? <img src={obj.src} alt="объект" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <div className="img-placeholder">🖼 Нет изображения</div>}</div>;

    default: return null;
  }
}
