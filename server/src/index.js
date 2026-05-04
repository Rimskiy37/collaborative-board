const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const boards = {};

app.post('/board', (req, res) => {
  const id = uuidv4();
  boards[id] = { id, objects: [] };
  console.log(`[board] создана доска: ${id}`);
  res.json({ id });
});

app.get('/board/:id', (req, res) => {
  const board = boards[req.params.id];
  if (!board) return res.status(404).json({ error: 'Доска не найдена' });
  res.json(board);
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const boardClients = {};

function broadcast(boardId, message, excludeWs = null) {
  const clients = boardClients[boardId];
  if (!clients) return;
  const data = JSON.stringify(message);
  clients.forEach(client => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

wss.on('connection', (ws) => {
  let currentBoardId = null;
  console.log('[ws] новое подключение');

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {
      case 'join-board': {
        const { boardId } = msg;
        if (!boards[boardId]) {
          ws.send(JSON.stringify({ type: 'error', message: 'Доска не найдена' }));
          return;
        }
        currentBoardId = boardId;
        if (!boardClients[boardId]) boardClients[boardId] = new Set();
        boardClients[boardId].add(ws);
        console.log(`[ws] клиент подключился к доске ${boardId}`);
        ws.send(JSON.stringify({ type: 'board-state', board: boards[boardId] }));
        break;
      }
      case 'create-object': {
        if (!currentBoardId) return;
        const obj = { ...msg.object, id: uuidv4() };
        boards[currentBoardId].objects.push(obj);
        broadcast(currentBoardId, { type: 'create-object', object: obj });
        ws.send(JSON.stringify({ type: 'create-object', object: obj }));
        console.log(`[ws] создан объект ${obj.type} на доске ${currentBoardId}`);
        break;
      }
      case 'update-object': {
        if (!currentBoardId) return;
        const board = boards[currentBoardId];
        const idx = board.objects.findIndex(o => o.id === msg.object.id);
        if (idx !== -1) {
          board.objects[idx] = { ...board.objects[idx], ...msg.object };
          broadcast(currentBoardId, { type: 'update-object', object: board.objects[idx] }, ws);
        }
        break;
      }
      case 'move-object': {
        if (!currentBoardId) return;
        const board = boards[currentBoardId];
        const idx = board.objects.findIndex(o => o.id === msg.id);
        if (idx !== -1) {
          board.objects[idx].x = msg.x;
          board.objects[idx].y = msg.y;
          broadcast(currentBoardId, { type: 'move-object', id: msg.id, x: msg.x, y: msg.y }, ws);
        }
        break;
      }
      case 'delete-object': {
        if (!currentBoardId) return;
        const board = boards[currentBoardId];
        board.objects = board.objects.filter(o => o.id !== msg.id);
        broadcast(currentBoardId, { type: 'delete-object', id: msg.id }, ws);
        console.log(`[ws] удалён объект ${msg.id}`);
        break;
      }
    }
  });

  ws.on('close', () => {
    if (currentBoardId && boardClients[currentBoardId]) {
      boardClients[currentBoardId].delete(ws);
      console.log(`[ws] клиент отключился от доски ${currentBoardId}`);
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
