import React, { useState, useEffect, useRef } from 'react'
import Circle from './shapes/Circle'
import Rectangle from './shapes/Rectangle'
import Segment from './shapes/Segment'
import TextBlock from './text/TextBlock'
import { cursors, behaviors } from './res/tools'
import './Board.scss'

function Board(props) {
  const ref = useRef(null)
  let [cursor, setCursor] = useState('')
  let [textState, setTextState] = useState({
    isWriting: false,
  })

  let [shapeState, setShapeState] = useState({
    isShaping: false,
  })

  let params = {
    config: props.config,
    prevShapeState: shapeState,
    setConfig: props.setConfig,
    setCursor: setCursor,
    setShapeState: setShapeState,
    setTextState: setTextState,
  }

  useEffect(() => {
    ref.current.focus()
    const ctx = ref.current.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, props.width, props.height)
  }, [props.width, props.height])

  useEffect(() => {
    if (typeof(cursors[props.tool]) === 'function') {
      setCursor(cursors[props.tool](params))
    } else {
      setCursor(cursors[props.tool])
    }
  }, [props.tool, props.config.eraser.size, props.config.erasing.color])

  const handleClick = (event) => {
    if (!textState.isWriting) {
      behaviors[props.tool](event, params)
    }
  }

  const handleMouseDown = (event) => {
    if (event.button === 0) {
      behaviors[props.tool](event, params)
    }
  }

  const handleMouseMove = (event) => {
    if (event.buttons === 1) {
      behaviors[props.tool](event, params)
    }
  }

  const handleKeyDown = (event) => {
    behaviors[props.tool](event, params)
  }

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
      className='bg-dark d-flex flex-grow-1 align-items-center
        justify-content-center h-100'>

      <canvas id='canvas' className='m-5' tabIndex='-1' width={props.width}
        height={props.height}
        ref={ref}
        style={{ cursor: cursor, boxShadow: '10px 10px 20px black' }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}>

        No support for canvas.
      </canvas>

      {shapeState.isShaping && shapes[shapeState.shape]}

      {textState.isWriting &&
        <TextBlock x={textState.x} y={textState.y} config={props.config}
          setTextState={setTextState} />
      }
    </div>
  )
}

export default Board
