const app = require('express')();
const httpServer = require('http').Server(app);
const { Server } = require('socket.io');
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000'],
  }
});

io.of(/\/(\w+)/).on("connection", (socket) => {
  socket.on('canvas-change', (data) => {
    socket.broadcast.emit('canvas-change', data);
  })
});

httpServer.listen(5000, () => {
  console.log(`Listening on port 5000`);
});
