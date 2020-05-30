import React, { useState } from 'react'
import Board from './Board'
import Sidebar from './Sidebar'

function App() {
  let [tool, setTool] = useState('none')

  return (
    <div className='app d-flex h-100'>
      <Sidebar setTool={setTool} />
      <Board tool={tool} width='750' height='500'/>
    </div>
  )
}

export default App
