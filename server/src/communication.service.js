module.exports = function setUpListeners(io) {
  const clientData = {};
  io.of(/\/(\w+)/).on("connection", (socket) => {
    if (!clientData[socket.nsp.name]) {
      clientData[socket.nsp.name] = {};
    }

    socket.on('user-joined', (data, callback) => {
      const users = Object.keys(clientData[socket.nsp.name]).map((id) => {
        return { ...clientData[socket.nsp.name][id], id };
      });

      callback(socket.id, users);
      clientData[socket.nsp.name][socket.id] = { x: 0, y: 0, color: data };
      socket.broadcast.emit('user-joined', { id: socket.id, x: 0, y: 0, color: data });

      socket.on('canvas-change', (data) => {
        socket.broadcast.emit('canvas-change', data);
      });
  
      socket.on('position-change', (position) => {
        clientData[socket.nsp.name][socket.id].x = position.x;
        clientData[socket.nsp.name][socket.id].y = position.y;
        socket.broadcast.emit('position-change', socket.id, position);
      });
  
      socket.on('disconnect', () => {
        delete clientData[socket.nsp.name][socket.id];
        socket.broadcast.emit('user-left', socket.id);
      });
    });
  });
}
