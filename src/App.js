import React, { useState } from 'react'
import Board from './Board'
import Sidebar from './Sidebar'

function App() {
  let [tool, setTool] = useState('none')

  return (
    <div className='app d-flex h-100'>
      <Sidebar setTool={setTool} />

      <div className='bg-dark d-flex flex-grow-1 align-items-center justify-content-center h-100'>
        <Board tool={tool} width='400' height='200'/>
      </div>
    </div>
  )
}

export default App
