import React, { useState, useEffect } from 'react'
import TextBlock from './text/TextBlock'
import { cursors, behaviors } from './res/tools'

function Board(props) {
  let initialState = {
    isWriting: false,
    x: -1,
    y: -1
  }

  let [state, setState] = useState(initialState)
  useEffect(() => {
    let canvas = document.getElementsByTagName('canvas')[0]
    let ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, props.width, props.height)
  }, [])

  const handleClick = (event) => {
    if (!state.isWriting) {
      behaviors[props.tool](event, setState)
    }
  }

  const handleMouseDown = (event) => {
    if (event.button === 0) {
      behaviors[props.tool](event)
    }
  }

  const handleMouseMove = (event) => {
    if (event.buttons === 1) {
      behaviors[props.tool](event)
    }
  }

  return (
    <div id='board-wrapper'
      className='bg-dark d-flex flex-grow-1 align-items-center
        justify-content-center h-100'>

      <canvas className='m-5' width={props.width} height={props.height}
        style={{ cursor: cursors[props.tool], boxShadow: '10px 10px 20px black' }}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}>

        No support for canvas.
      </canvas>

      {state.isWriting &&
        <TextBlock x={state.x} y={state.y} setState={setState} />
      }
    </div>
  )
}

export default Board
