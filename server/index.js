require('dotenv').config();
const { createServer } = require('http');
const { Server } = require('socket.io');

const allowedURLS = process.env.ALLOWED_URLS.split(',');

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: allowedURLS,
  }
});

const clientData = {};

io.of(/\/(\w+)/).on("connection", (socket) => {
  if (!clientData[socket.nsp.name]) {
    clientData[socket.nsp.name] = {};
  }

  socket.on('new-client', (data) => {
    clientData[socket.nsp.name][socket.id] = { x: 0, y: 0, color: data };
    socket.nsp.emit('client-connection-change', clientData[socket.nsp.name]);
  });

  socket.on('canvas-change', (data) => {
    socket.broadcast.emit('canvas-change', data);
  });

  socket.on('client-position-change', (data) => {
    clientData[socket.nsp.name][socket.id].x = data.x;
    clientData[socket.nsp.name][socket.id].y = data.y;
    const position = { id: socket.id, x: data.x, y: data.y };
    socket.broadcast.emit('client-position-change', position);
  });

  socket.on('disconnect', () => {
    delete clientData[socket.nsp.name][socket.id];
    socket.nsp.emit('client-connection-change', clientData[socket.nsp.name]);
  });
});

httpServer.listen(5000, () => {
  console.log(`Listening on port 5000`);
});
