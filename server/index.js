require('dotenv').config();
const { createServer } = require('http');
const { Server } = require('socket.io');
const setUpListeners = require('./src/communication.service');

const allowedURLS = process.env.ALLOWED_URLS.split(',');

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: allowedURLS,
  }
});

setUpListeners(io);

httpServer.listen(5000, () => {
  console.log(`Listening on port 5000`);
});
