import React, { useState, useEffect } from 'react'
import { cursors, behaviors } from './res/tools'

const Board = React.memo(
  (props) => {
    let [isWriting, setIsWriting] = useState(false)
    useEffect(() => {
      console.log('rendering', props.tool)
      let canvas = document.getElementsByTagName('canvas')[0]
      let ctx = canvas.getContext('2d')
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, props.width, props.height)
    }, [])

    const handleClick = (event) => {
      if (!isWriting) {
        behaviors[props.tool](event, setIsWriting)
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
      <canvas className='m-5' width={props.width} height={props.height}
        style={{ cursor: cursors[props.tool], boxShadow: '10px 10px 20px black' }}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}>

        No support for canvas.
      </canvas>
    )
  },

  (prevProps, nextProps) => {
    if (prevProps.tool === nextProps.tool) {
      return true
    }

    return false
  }
)

export default Board
