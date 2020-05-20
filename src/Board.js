import React from 'react'
import './Board.scss'

function Board(props) {
  return (
    <div className='bg-dark d-flex flex-grow-1 justify-content-center h-100'>
      <canvas className='w-75 m-5' style={{ cursor: props.cursor }}>
        No support for canvas.
      </canvas>
    </div>
  )
}

export default Board
