import React, { useState } from 'react'
import Board from './Board'
import Sidebar from './Sidebar'

function App() {
  let [cursor, setCursor] = useState('')

  return (
    <div className='app d-flex h-100'>
      <Sidebar setBoardCursor={setCursor} />
      <Board cursor={cursor} />
    </div>
  )
}

export default App
