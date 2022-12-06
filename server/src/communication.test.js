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

  test('user receives ID, color, and user list after connecting to a room', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room`);
    const socket2 = Client(`http://localhost:${port}/room`);
    sockets.push(socket1, socket2);

    socket1.once('connect', () => {
      socket2.once('connect', () => {
        socket1.emit('user-joined', (id1, color1) => {
          socket2.emit('user-joined', (id2, color2, users) => {
            expect(typeof id2).toBe('string');
            expect(typeof color2).toBe('string');
            expect(users).toContainEqual({ id: id1, x: 0, y: 0, color: color1 });
            expect(users).not.toContainEqual({ id: id2, x: 0, y: 0, color: color2 });
            done();
          });
        });
      });
    });
  });

  test('users in a room are notified when another user connects to that room', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room`);
    const socket2 = Client(`http://localhost:${port}/room`);
    sockets.push(socket1, socket2);

    socket1.once('connect', () => {
      socket2.once('connect', () => {
        let userData = {};
        socket1.once('user-joined', (user) => {
          expect(user).toMatchObject({ id: userData.id, x: 0, y: 0, color: userData.color });
          done();
        });

        socket2.emit('user-joined', (id, color) => { userData = { id, color }; });
      });
    });
  });

  test('user is not notified of its own connection to a room', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room`);
    const socket2 = Client(`http://localhost:${port}/room`);
    sockets.push(socket1, socket2);
    const timeoutId = setTimeout(() => { done(); }, 3000);

    socket1.once('connect', () => {
      socket2.once('connect', () => {
        socket1.once('user-joined', () => {
          clearTimeout(timeoutId);
          done(new Error('user should not be notified'));
        });

        socket1.emit('user-joined', () => {});
      });
    });
  });

  test('users are not notified of connections in other rooms', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room1`);
    const socket2 = Client(`http://localhost:${port}/room2`);
    sockets.push(socket1, socket2);
    const timeoutId = setTimeout(() => { done(); }, 3000);

    socket1.once('connect', () => {
      socket1.emit('user-joined', () => {});
    });

    socket2.once('connect', () => {
      socket2.once('user-joined', () => {
        clearTimeout(timeoutId);
        done(new Error('user should not be notified'));
      });
    });
  });

  test('users in a room are notified when another user disconnects from that room', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room`);
    const socket2 = Client(`http://localhost:${port}/room`);
    sockets.push(socket1, socket2);
    
    socket1.once('connect', () => {
      socket2.once('connect', () => {
        socket2.once('user-joined', (user) => {
          socket2.once('user-left', (id) => {
            expect(id).toBe(user.id);
            done();
          });

          socket1.disconnect();
        });

        socket1.emit('user-joined', () => {});
      });
    });
  });

  test('users are not notified of disconnections in other rooms', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room1`);
    const socket2 = Client(`http://localhost:${port}/room2`);
    sockets.push(socket1, socket2);
    const timeoutId = setTimeout(() => { done(); }, 3000);

    socket1.once('connect', () => {
      socket1.emit('user-joined', () => {});
    });

    socket2.once('connect', () => {
      socket2.once('user-left', () => {
        clearTimeout(timeoutId);
        done(new Error('user should not be notified'));
      });

      socket1.disconnect();
    });
  });

  test('users are notified when canvas is changed', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room`);
    const socket2 = Client(`http://localhost:${port}/room`);
    sockets.push(socket1, socket2);

    socket1.once('connect', () => {
      socket1.emit('user-joined', () => {});
    });

    socket2.once('connect', () => {
      socket2.once('user-joined', () => {
        socket2.once('canvas-change', () => {
          done();
        });

        socket1.emit('canvas-change', {});
      });
    });
  });

  test('users are not notified of canvas changes in other rooms', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room1`);
    const socket2 = Client(`http://localhost:${port}/room2`);
    sockets.push(socket1, socket2);
    const timeoutId = setTimeout(() => { done(); }, 3000);

    socket1.once('connect', () => {
      socket1.emit('user-joined', () => {});
    });

    socket2.once('connect', () => {
      socket2.once('user-joined', () => {
        socket2.once('canvas-change', () => {
          clearTimeout(timeoutId);
          done(new Error('user should not be notified'));
        });

        socket1.emit('canvas-change', {});
      });
    });
  });

  test('users are notified when another user moves their cursor', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room`);
    const socket2 = Client(`http://localhost:${port}/room`);
    sockets.push(socket1, socket2);

    socket1.once('connect', () => {
      socket1.emit('user-joined', () => {});
    });

    socket2.once('connect', () => {
      socket2.once('user-joined', (user) => {
        socket2.once('position-change', (id, position) => {
          expect(id).toBe(user.id);
          expect(position).toMatchObject({ x: 5, y: 5 });
          done();
        });
      });

      socket1.emit('position-change', { x: 5, y: 5 });
    });
  });

  test('users are not notified of user in another room moves their cursor', (done) => {
    const port = httpServer.address().port;
    const socket1 = Client(`http://localhost:${port}/room1`);
    const socket2 = Client(`http://localhost:${port}/room2`);
    sockets.push(socket1, socket2);
    const timeoutId = setTimeout(() => { done(); }, 3000);

    socket1.once('connect', () => {
      socket1.emit('user-joined', () => {});
    });

    socket2.once('connect', () => {
      socket2.once('user-joined', () => {
        socket2.once('position-change', () => {
          clearTimeout(timeoutId);
          done(new Error('user should not be notified'));
        });

        socket1.emit('position-change', { x: 5, y: 5 });
      });
    });
  });
});
