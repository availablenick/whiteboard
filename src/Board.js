import React, { useState, useEffect, useRef } from 'react'
import Circle from './shapes/Circle'
import Rectangle from './shapes/Rectangle'
import Segment from './shapes/Segment'
import TextBlock from './text/TextBlock'
import { cursors, behaviors } from './res/tools'
import './Board.scss'

function Board(props) {
  const ref = useRef(null)
  let [textState, setTextState] = useState({
    isWriting: false,
  })

  let [shapeState, setShapeState] = useState({
    isShaping: false,
  })

  useEffect(() => {
    const ctx = ref.current.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, props.width, props.height)
  }, [])

  const handleClick = (event) => {
    if (!textState.isWriting) {
      behaviors[props.tool](event, setTextState)
    }
  }

  const handleMouseDown = (event) => {
    if (event.button === 0) {
      behaviors[props.tool](event)
    }
  }

  const handleMouseMove = (event) => {
    if (event.buttons === 1) {
      behaviors[props.tool](event, setShapeState, shapeState)
    }
  }

  let shapes = {}
  if (shapeState.isShaping) {
    shapes.segment = <Segment x={shapeState.x} y={shapeState.y}
      setShapeState={setShapeState} />

    shapes.rectangle = <Rectangle x={shapeState.x} y={shapeState.y}
      setShapeState={setShapeState} />

    shapes.circle = <Circle x={shapeState.x} y={shapeState.y}
      setShapeState={setShapeState} />
  }

  return (
    <div id='board-wrapper'
      className='bg-dark d-flex flex-grow-1 align-items-center
        justify-content-center h-100'>

      <canvas className='m-5' width={props.width} height={props.height}
        ref={ref}
        style={{ cursor: cursors[props.tool], boxShadow: '10px 10px 20px black' }}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}>

        No support for canvas.
      </canvas>

      {/* <div className='line-shape'>
        <div className='res left'></div>
        <div className='res right'></div>
      </div> */}

      {shapeState.isShaping && shapes[shapeState.shape]}

      {textState.isWriting &&
        <TextBlock x={textState.x} y={textState.y} setTextState={setTextState} />
      }
    </div>
  )
}

export default Board
