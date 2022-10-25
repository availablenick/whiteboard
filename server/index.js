require('dotenv').config();
const app = require('express')();
const httpServer = require('http').Server(app);
const { Server } = require('socket.io');
const cors = require('cors');

const allowedURLS = process.env.ALLOWED_URLS.split(',');

const corsOptions = {
  origin: allowedURLS,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const io = new Server(httpServer, {
  cors: {
    origin: allowedURLS,
  }
});

const clientData = {};

io.of(/\/(\w+)/).on("connection", (socket) => {
  if (!clientData[socket.nsp.name]) {
    clientData[socket.nsp.name] = {};
  } else {
    clientData[socket.nsp.name][socket.id] = { x: 0, y: 0 };
    socket.nsp.emit('client-connection-change', clientData[socket.nsp.name]);
  }

  socket.on('canvas-change', (data) => {
    socket.broadcast.emit('canvas-change', data);
  });

  socket.on('client-position-change', (data) => {
    const position = { id: socket.id, x: data.x, y: data.y };
    socket.broadcast.emit('client-position-change', position);
  })

  socket.on('disconnect', () => {
    delete clientData[socket.nsp.name][socket.id];
    socket.nsp.emit('client-connection-change', clientData[socket.nsp.name]);
  });
});

httpServer.listen(5000, () => {
  console.log(`Listening on port 5000`);
});
