import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import ShapeSelector from './boxes/shapes/ShapeSelector';
import TextBlock from './boxes/text/TextBlock';
import Pointer from './Pointer';
import { getCursor, executeAction } from './sidebar/tools/items/toolHandler';
import './Board.scss';

function Board({ config, setConfig, tool, width, height }) {
  const canvasRef = useRef(null);
  const [cursor, setCursor] = useState('');
  const [textState, setTextState] = useState({ isWriting: false });
  const [shapeState, setShapeState] = useState({ isShaping: false });
  const [connectedUsers, setConnectedUsers] = useState({});

  useEffect(() => {
    const canvasChangeListener = (event) => {
      socket.emit('canvas-change', event.target.toDataURL());
    };

    const mouseMoveListener = (event) => {
      socket.emit('position-change', { x: event.clientX, y: event.clientY });
    };

    let socket = null;
    const canvas = canvasRef.current;
    const match = /\/(\w+)/.exec(window.location.pathname);
    if (match) {
      const slug = match[1];
      socket = io(`${process.env.REACT_APP_WEBSOCKET_SERVER_URL}/${slug}`, {
        reconnectionDelayMax: 10000,
      });

      setUpSocketListeners(socket, canvasRef.current, { setConnectedUsers });
      canvasRef.current.addEventListener('canvas-change', canvasChangeListener);
      document.addEventListener('mousemove', mouseMoveListener);
    }

    return () => {
      if (match && socket) {
        socket.close();
      }

      if (canvas) {
        canvas.removeEventListener('canvas-change', canvasChangeListener);
      }

      document.removeEventListener('mousemove', mouseMoveListener);
    };
  }, []);

  useEffect(() => {
    canvasRef.current.focus();
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  useEffect(() => {
    (async () => { setCursor(await getCursor(tool, config)); })();
  }, [tool, config.eraser.size, config.erasing.color]);

  const invokeToolAction = (event) => {
    executeAction(tool, event, { config, setConfig, setShapeState, setTextState });
  };

  const handleClick = (event) => {
    if (!textState.isWriting) {
      invokeToolAction(event);
    }
  };

  return (
    <div
      id="board-wrapper"
      className="bg-dark d-flex flex-column flex-grow-1 align-items-center
        justify-content-center h-100"
    >
      <canvas
        id="canvas"
        className="m-5"
        tabIndex="-1"
        width={width}
        height={height}
        ref={canvasRef}
        style={{ cursor, boxShadow: '10px 10px 20px black' }}
        onClick={handleClick}
        onKeyDown={invokeToolAction}
        onMouseDown={invokeToolAction}
        onMouseMove={invokeToolAction}
      >
        No support for canvas.
      </canvas>

      {makeUserPointers(connectedUsers)}

      {shapeState.isShaping
        && (
          <ShapeSelector
            shape={shapeState.shape}
            x={shapeState.x}
            y={shapeState.y}
            config={config}
            setShapeState={setShapeState}
          />
        )}

      {textState.isWriting
        && (
          <TextBlock
            x={textState.x}
            y={textState.y}
            config={config}
            setTextState={setTextState}
          />
        )}
    </div>
  );
}

function setUpSocketListeners(socket, canvas, { setConnectedUsers }) {
  socket.on('connect', () => {
    const color = generateRGB();
    socket.emit('user-joined', `rgb(${color.r}, ${color.g}, ${color.b})`, (_, users) => {
      const connectedUsers = {};
      users.forEach((user) => {
        connectedUsers[user.id] = user;
      });

      setConnectedUsers(connectedUsers);
    });
  });

  socket.on('canvas-change', (data) => {
    drawURLImageOnCanvas(canvas, data);
  });

  socket.on('user-joined', (user) => {
    setConnectedUsers((prev) => {
      const next = { ...prev, [user.id]: user };
      return next;
    });
  });

  socket.on('user-left', (id) => {
    setConnectedUsers((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  });

  socket.on('position-change', (id, position) => {
    setConnectedUsers((prev) => ({
      ...prev,
      [id]: {
        x: position.x,
        y: position.y,
        color: prev[id] ? prev[id].color : '',
      },
    }));
  });
}

function drawURLImageOnCanvas(canvas, dataURL) {
  const img = document.createElement('img');
  img.src = dataURL;
  img.addEventListener('load', () => {
    canvas.getContext('2d').drawImage(img, 0, 0);
  });
}

function generateRGB() {
  const MAX = 255;
  return {
    r: Math.floor(Math.random() * MAX),
    g: Math.floor(Math.random() * MAX),
    b: Math.floor(Math.random() * MAX),
  };
}

function makeUserPointers(users) {
  return Object.keys(users)
    .map((id) => {
      const user = users[id];
      return <Pointer key={id} userId={id} x={user.x} y={user.y} color={user.color} />;
    });
}

export default Board;
