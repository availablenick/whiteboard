import React, { useState, useEffect } from 'react'
import { cursors, behaviors } from './res/tools'

function Board(props) {
  let [isDown, setIsDown] = useState(false)
  useEffect(() => {
    let canvas = document.getElementsByTagName('canvas')[0]
    let ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, props.width, props.height)
  }, [])

  const handleMouseUp = () => { setIsDown(false) }
  const handleMouseDown = (event) => {
    setIsDown(true)
    behaviors[props.tool](event)
  }

  const handleMouseMove = (event) => {
    if (isDown)
      behaviors[props.tool](event)
  }

  const handleMouseOut = (event) => {
    let newEvent = new MouseEvent('mouseup', { bubbles: true })
    event.target.dispatchEvent(newEvent)
  }

  return (
    <canvas className='m-5' width={props.width} height={props.height}
      style={{ cursor: cursors[props.tool] }}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}>
      
      {cursors[props.tool]}
      No support for canvas.
    </canvas>
  )
}

export default Board
