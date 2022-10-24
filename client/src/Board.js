import React, { useState, useEffect, useRef } from 'react'
import { io } from "socket.io-client"
import Circle from './shapes/Circle'
import Rectangle from './shapes/Rectangle'
import Segment from './shapes/Segment'
import TextBlock from './text/TextBlock'
import Pointer from './Pointer'
import { makeItem } from './res/tools/toolHandler'
import './Board.scss'

function generateRGB() {
  const MAX = 255;
  return {
    r: Math.floor(Math.random() * MAX),
    g: Math.floor(Math.random() * MAX),
    b: Math.floor(Math.random() * MAX),
  };
}

function Board(props) {
  const ref = useRef(null)
  let [cursor, setCursor] = useState('')
  let [textState, setTextState] = useState({
    isWriting: false,
  })

  let [shapeState, setShapeState] = useState({
    isShaping: false,
  })

  let [id, setId] = useState('');
  let [connectedUsers, setConnectedUsers] = useState({})

  let params = {
    config: props.config,
    setConfig: props.setConfig,
    setShapeState: setShapeState,
    setTextState: setTextState,
  }

  useEffect(() => {
    let socket = null;
    let match = /\/(\w+)/.exec(window.location.pathname)
    if (match) {
      let slug = match[1];
      socket = io(`ws://localhost:5000/${slug}`, {
        reconnectionDelayMax: 10000,
      })

      socket.on('connect', () => {
        setId(socket.id);
      })

      socket.on('canvas-change', (data) => {
        drawImageOnCanvas(ref.current, data);
      });

      socket.on('client-connection-change', (data) => {
        const users = {};
        Object.keys(data).forEach((id) => {
          users[id] = {
            x: data[id].x,
            y: data[id].y,
            color: generateRGB(),
          };
        })
        setConnectedUsers(users);
      });

      socket.on('client-position-change', (data) => {
        setConnectedUsers((prev) => {
          return {
            ...prev,
            [data.id]: {
              x: data.x,
              y: data.y,
              color: prev[data.id].color,
            }
          };
        });
      });

      ref.current.addEventListener('canvas-change', (event) => {
        socket.emit('canvas-change', event.target.toDataURL());
      });

      document.addEventListener('mousemove', (event) => {
        const data = { x: event.clientX, y: event.clientY };
        socket.emit('client-position-change', data);
      });
    }

    return () => {
      if (match) {
        socket.close()
      }
    }
  }, []);

  useEffect(() => {
    ref.current.focus()
    const ctx = ref.current.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, props.width, props.height)
  }, [props.width, props.height])

  useEffect(() => {
    (async () => { setCursor(await makeItem(props.tool, params).getCursor()); })();
  }, [props.tool, props.config.eraser.size, props.config.erasing.color])

  const invokeToolAction = (event) => {
    makeItem(props.tool, params).executeAction(event);
  }

  const drawImageOnCanvas = (canvas, dataURL) => {
    let img = document.createElement('img');
    img.src = dataURL;
    img.addEventListener('load', () => {
      canvas.getContext('2d').drawImage(img, 0, 0);
    })
  }

  const handleClick = (event) => {
    if (!textState.isWriting) {
      invokeToolAction(event);
    }
  }

  let userPointers = Object.keys(connectedUsers)
    .filter((userId) => id !== userId)
    .map((userId) => {
      const user = connectedUsers[userId];
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

  let shapes = {}
  if (shapeState.isShaping) {
    shapes.segment = <Segment x={shapeState.x} y={shapeState.y}
      config={props.config} setShapeState={setShapeState} />

    shapes.rectangle = <Rectangle x={shapeState.x} y={shapeState.y}
      config={props.config} setShapeState={setShapeState} />

    shapes.circle = <Circle x={shapeState.x} y={shapeState.y}
      config={props.config} setShapeState={setShapeState} />
  }

  return (
    <div id='board-wrapper'
      className='bg-dark d-flex flex-column flex-grow-1 align-items-center
        justify-content-center h-100'>

      <canvas id='canvas' className='m-5' tabIndex='-1' width={props.width}
        height={props.height}
        ref={ref}
        style={{ cursor: cursor, boxShadow: '10px 10px 20px black' }}
        onClick={handleClick}
        onKeyDown={invokeToolAction}
        onMouseDown={invokeToolAction}
        onMouseMove={invokeToolAction}>

        No support for canvas.
      </canvas>

      {userPointers}

      {shapeState.isShaping && shapes[shapeState.shape]}

      {textState.isWriting &&
        <TextBlock x={textState.x} y={textState.y} config={props.config}
          setTextState={setTextState} />
      }
    </div>
  )
}

export default Board
