const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');
const setUpListeners = require('./communication.service');

describe('client communication', () => {
  let httpServer, sockets;

  beforeAll(() => {
    sockets = [];
    httpServer = createServer();
    const io = new Server(httpServer);
    setUpListeners(io);
    httpServer.listen(0);
  });

  afterAll(() => {
    httpServer.close();
  });

  beforeEach(() => {
    sockets.length = 0;
  });

  afterEach(() => {
    sockets.forEach((socket) => {
      socket.removeAllListeners();
      socket.disconnect();
    });
  });

  test('users in a room are notified when another user connects to that room', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room`);
    const socket2 = Client(`http://localhost:${port}/room`);
    sockets.push(socket1, socket2);

    socket1.once("connect", () => {
      socket1.emit("new-client", "black");
    });

    socket2.once("connect", () => {
      socket2.once("client-connection-change", (data) => {
        expect(data).toHaveProperty(socket1.id, { x: 0, y: 0, color: "black" });
        done();
      });
    });
  });

  test('users are not notified of connections in other rooms', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room1`);
    const socket2 = Client(`http://localhost:${port}/room2`);
    sockets.push(socket1, socket2);
    const timeoutId = setTimeout(() => { done(); }, 3000);

    socket1.once("connect", () => {
      socket1.emit("new-client", "black");
    });

    socket2.once("connect", () => {
      socket2.once("client-connection-change", () => {
        clearTimeout(timeoutId);
        done(new Error("user should not be notified"));
      });
    });
  });

  test('users in a room are notified when another user disconnects from that room', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room`);
    const socket2 = Client(`http://localhost:${port}/room`);
    sockets.push(socket1, socket2);
    
    socket1.once("connect", () => {
      socket1.emit("new-client", "black");
    });
    
    socket2.once("connect", () => {
      socket2.once("client-connection-change", () => {
        const socket1Id = socket1.id;
        socket2.once("client-connection-change", (data) => {
          expect(data).not.toHaveProperty(socket1Id);
          done();
        });

        socket1.disconnect();
      });
    });
  });

  test('users are not notified of disconnections in other rooms', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room1`);
    const socket2 = Client(`http://localhost:${port}/room2`);
    sockets.push(socket1, socket2);
    const timeoutId = setTimeout(() => { done(); }, 3000);

    socket1.once("connect", () => {
      socket1.emit("new-client", "black");
    });

    socket2.once("connect", () => {
      socket2.once("client-connection-change", () => {
        clearTimeout(timeoutId);
        done(new Error("user should not be notified"));
      });

      socket1.disconnect();
    });
  });

  test('users are notified when canvas is changed', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room`);
    const socket2 = Client(`http://localhost:${port}/room`);
    sockets.push(socket1, socket2);

    socket1.once("connect", () => {
      socket1.emit("new-client", "black");
    });

    socket2.once("connect", () => {
      socket2.once("client-connection-change", () => {
        socket2.once("canvas-change", () => {
          done();
        });

        socket1.emit("canvas-change", {});
      });
    });
  });

  test('users are not notified of canvas changes in other rooms', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room1`);
    const socket2 = Client(`http://localhost:${port}/room2`);
    sockets.push(socket1, socket2);
    const timeoutId = setTimeout(() => { done(); }, 3000);

    socket1.once("connect", () => {
      socket1.emit("new-client", "black");
    });

    socket2.once("connect", () => {
      socket2.once("client-connection-change", () => {
        socket2.once("canvas-change", () => {
          clearTimeout(timeoutId);
          done(new Error("user should not be notified"));
        });

        socket1.emit("canvas-change", {});
      });
    });
  });

  test('users are notified when another user moves their cursor', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room`);
    const socket2 = Client(`http://localhost:${port}/room`);
    sockets.push(socket1, socket2);

    socket1.once("connect", () => {
      socket1.emit("new-client", "black");
    });

    socket2.once("connect", () => {
      socket2.once("client-connection-change", () => {
        socket2.once("client-position-change", (data) => {
          expect(data).toMatchObject({ id: socket1.id, x: 5, y: 5 });
          done();
        });

        socket1.emit("client-position-change", { x: 5, y: 5 });
      });
    });
  });

  test('users are not notified of user in another room moves their cursor', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room1`);
    const socket2 = Client(`http://localhost:${port}/room2`);
    sockets.push(socket1, socket2);
    const timeoutId = setTimeout(() => { done(); }, 3000);

    socket1.once("connect", () => {
      socket1.emit("new-client", "black");
    });

    socket2.once("connect", () => {
      socket2.once("client-connection-change", () => {
        socket2.once("client-position-change", () => {
          clearTimeout(timeoutId);
          done(new Error("user should not be notified"));
        });

        socket1.emit("client-position-change", { x: 5, y: 5 });
      });
    });
  });
});
