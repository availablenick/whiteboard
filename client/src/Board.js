import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import ShapeSelector from './shapes/ShapeSelector';
import TextBlock from './text/TextBlock';
import Pointer from './Pointer';
import makeItem from './sidebar/tools/items/toolHandler';
import './Board.scss';

function Board({ config, setConfig, tool, width, height }) {
  const ref = useRef(null);
  const [cursor, setCursor] = useState('');
  const [textState, setTextState] = useState({ isWriting: false });
  const [shapeState, setShapeState] = useState({ isShaping: false });
  const [id, setId] = useState('');
  const [connectedUsers, setConnectedUsers] = useState({});

  const params = { config, setConfig, setShapeState, setTextState };

  useEffect(() => {
    const canvasChangeListener = (event) => {
      socket.emit('canvas-change', event.target.toDataURL());
    };

    const mouseMoveListener = (event) => {
      const data = { x: event.clientX, y: event.clientY };
      socket.emit('client-position-change', data);
    };

    let socket = null;
    const canvas = ref.current;
    const match = /\/(\w+)/.exec(window.location.pathname);
    if (match) {
      const slug = match[1];
      socket = io(`${process.env.REACT_APP_WEBSOCKET_SERVER_URL}/${slug}`, {
        reconnectionDelayMax: 10000,
      });

      setUpSocketListeners(socket, ref.current, { setId, setConnectedUsers });
      ref.current.addEventListener('canvas-change', canvasChangeListener);
      document.addEventListener('mousemove', mouseMoveListener);
    }

    return () => {
      if (match && socket) {
        socket.close();
      }

      if (canvas) {
        canvas.removeEventListener(canvasChangeListener);
      }

      document.removeEventListener(mouseMoveListener);
    };
  }, []);

  useEffect(() => {
    ref.current.focus();
    const ctx = ref.current.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  useEffect(() => {
    (async () => { setCursor(await makeItem(tool, params).getCursor()); })();
  }, [tool, config.eraser.size, config.erasing.color]);

  const invokeToolAction = (event) => {
    makeItem(tool, params).executeAction(event);
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
        ref={ref}
        style={{ cursor, boxShadow: '10px 10px 20px black' }}
        onClick={handleClick}
        onKeyDown={invokeToolAction}
        onMouseDown={invokeToolAction}
        onMouseMove={invokeToolAction}
      >
        No support for canvas.
      </canvas>

      {makeUserPointers(connectedUsers, id)}

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

function setUpSocketListeners(socket, canvas, { setId, setConnectedUsers }) {
  socket.on('connect', () => {
    setId(socket.id);
  });

  socket.on('canvas-change', (data) => {
    drawURLImageOnCanvas(canvas, data);
  });

  socket.on('client-connection-change', (data) => {
    const users = {};
    Object.keys(data).forEach((userId) => {
      users[userId] = {
        x: data[userId].x,
        y: data[userId].y,
        color: generateRGB(),
      };
    });

    setConnectedUsers(users);
  });

  socket.on('client-position-change', (data) => {
    setConnectedUsers((prev) => ({
      ...prev,
      [data.id]: {
        x: data.x,
        y: data.y,
        color: prev[data.id].color,
      },
    }));
  });
}

const drawURLImageOnCanvas = (canvas, dataURL) => {
  const img = document.createElement('img');
  img.src = dataURL;
  img.addEventListener('load', () => {
    canvas.getContext('2d').drawImage(img, 0, 0);
  });
};

function generateRGB() {
  const MAX = 255;
  return {
    r: Math.floor(Math.random() * MAX),
    g: Math.floor(Math.random() * MAX),
    b: Math.floor(Math.random() * MAX),
  };
}

function makeUserPointers(users, excludedId) {
  return Object.keys(users)
    .filter((userId) => userId !== excludedId)
    .map((userId) => {
      const user = users[userId];
      return (
        <Pointer
          key={userId}
          userId={userId}
          x={user.x}
          y={user.y}
          color={`rgb(${user.color.r}, ${user.color.g}, ${user.color.b})`}
        />
      );
    });
}

export default Board;
