import React, { useRef, useState, useCallback } from 'react';
import ObjectRenderer from './ObjectRenderer';
import './CanvasBoard.css';

export default function CanvasBoard({
  objects, selectedId, setSelectedId,
  tool, setTool,
  onCreateObject, onMoveObject, onDeleteObject
}) {
  const boardRef = useRef(null);
  const dragRef = useRef(null); // { id, startX, startY, origX, origY }

  // ── Клик по холсту — создать объект ──────────────────────
  const handleBoardClick = useCallback((e) => {
    if (tool === 'select') {
      setSelectedId(null);
      return;
    }
    if (dragRef.current?.moved) return; // это был drag

    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'image') {
      const src = prompt('Введите URL изображения:');
      if (!src) return;
      onCreateObject('image', x, y);
      // src передадим отдельно через update — пока просто создадим с пустым src
    } else {
      onCreateObject(tool, x, y);
    }
    setTool('select');
  }, [tool, onCreateObject, setTool, setSelectedId]);

  // ── Drag объекта ──────────────────────────────────────────
  const handleObjectMouseDown = useCallback((e, obj) => {
    if (tool !== 'select') return;
    e.stopPropagation();
    setSelectedId(obj.id);

    const startX = e.clientX;
    const startY = e.clientY;
    dragRef.current = { id: obj.id, startX, startY, origX: obj.x, origY: obj.y, moved: false };

    const onMove = (me) => {
      const dx = me.clientX - startX;
      const dy = me.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragRef.current.moved = true;
        onMoveObject(obj.id, dragRef.current.origX + dx, dragRef.current.origY + dy);
      }
    };

    const onUp = (me) => {
      if (dragRef.current?.moved) {
        const dx = me.clientX - startX;
        const dy = me.clientY - startY;
        onMoveObject(obj.id, dragRef.current.origX + dx, dragRef.current.origY + dy);
      }
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setTimeout(() => { if (dragRef.current) dragRef.current.moved = false; }, 0);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [tool, setSelectedId, onMoveObject]);

  // ── Delete key ────────────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
      onDeleteObject(selectedId);
    }
  }, [selectedId, onDeleteObject]);

  return (
    <div
      className={`canvas-board ${tool !== 'select' ? 'cursor-crosshair' : ''}`}
      ref={boardRef}
      onClick={handleBoardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {objects.map(obj => (
        <ObjectRenderer
          key={obj.id}
          obj={obj}
          selected={obj.id === selectedId}
          onMouseDown={(e) => handleObjectMouseDown(e, obj)}
          onClick={(e) => { e.stopPropagation(); setSelectedId(obj.id); }}
        />
      ))}

      {objects.length === 0 && (
        <div className="canvas-hint">
          Выбери инструмент слева и кликни на доску чтобы добавить объект
        </div>
      )}
    </div>
  );
}
